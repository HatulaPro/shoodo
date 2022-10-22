import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';
import { useContext, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useUser } from '../../../hooks/useUser';
import { MessageHandlerContext } from '../../../pages/projects/[id]';
import type { PublicUser } from '../../../utils/supabase/auth';
import type { PermWithUser } from '../../../utils/supabase/perms';
import type { FullProject } from '../../../utils/supabase/projects';

type ProjectPermsDialogProps = {
	open: boolean;
	project: FullProject;
	handleClose: () => void;
	manualUpdate: (newProject: FullProject) => void;
};

interface AddUserForm {
	email: string;
	canEdit: 'viewAndEdit' | 'viewOnly';
}

type UserEntry = {
	id: number;
	permStatus: 'owner' | 'viewAndEdit' | 'viewOnly';
	permStatusAsStr: 'Owner' | 'View & Edit' | 'View Only';
	isOnline: boolean;
	user: PublicUser;
};

const ProjectPermsDialog: FC<ProjectPermsDialogProps> = ({ project, open, handleClose, manualUpdate }) => {
	const { user, access_token } = useUser();
	const isOwner = Boolean(user) && user?.id === project?.user_id;
	const { control, handleSubmit, reset, watch, setValue } = useForm<AddUserForm>();
	const theme = useTheme();

	const messageHandler = useContext(MessageHandlerContext);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const editPermsMutation = useMutation(
		async (data: AddUserForm) => {
			if (!isOwner) return;
			if (data.email === project.user.email) {
				throw new Error('Self invite is not allowed');
			}
			const res = await fetch('/api/perms/editPerm', {
				method: 'POST',
				headers: new Headers({ 'Content-Type': 'application/json', Authorization: `Bearer ${access_token}` }),
				credentials: 'same-origin',
				body: JSON.stringify({ ...data, projectId: project.id }),
			});
			const jsoned = await res.json();
			if (jsoned.success) {
				const result = jsoned.data as PermWithUser;
				project.perms = [result, ...project.perms.filter((p) => p.id !== result.id)];
				manualUpdate(project);
				return true;
			} else {
				throw new Error(jsoned.error.message);
			}
		},
		{
			onSuccess: () => {
				reset({ email: '', canEdit: 'viewAndEdit' });
			},
		}
	);
	async function removePerm(permId: number) {
		if (!isOwner) return;

		fetch('/api/perms/removePerm', {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			credentials: 'same-origin',
			body: JSON.stringify({ permId }),
		});
		project.perms = project.perms.filter((p) => p.id !== permId);
		manualUpdate(project);
	}

	function onSubmit(data: AddUserForm) {
		editPermsMutation.mutate(data);
	}

	const queryEmail = watch('email');

	const currentUsersList = useMemo<UserEntry[]>(() => {
		const onlineUsersSet = new Set(messageHandler?.onlineUsers.map((x) => x.user));
		const usersWithPerms = project.perms
			.filter((perm) => (queryEmail ? perm.user.email!.toLowerCase().includes(queryEmail.toLowerCase()) : true))
			.map((current) => {
				return {
					id: current.id,
					permStatus: current.can_edit ? 'viewAndEdit' : 'viewOnly',
					permStatusAsStr: current.can_edit ? 'View & Edit' : 'View Only',
					user: current.user,
					isOnline: onlineUsersSet.has(current.user.email!),
				} as UserEntry;
			})
			.sort((x, y) => {
				return x.isOnline === y.isOnline ? 0 : x.isOnline ? -1 : 1;
			});
		if (!queryEmail || project.user.email!.toLowerCase().includes(queryEmail.toLowerCase())) {
			return [{ id: -1, permStatus: 'owner', isOnline: onlineUsersSet.has(project.user.email!), permStatusAsStr: 'Owner', user: project.user }, ...usersWithPerms];
		}
		return usersWithPerms;
	}, [queryEmail, project?.perms, project?.user, messageHandler?.onlineUsers]);

	return (
		<Dialog open={open} onClose={handleClose} fullWidth={!isSmallScreen} fullScreen={isSmallScreen}>
			<DialogTitle>Online Users{project.perms && ` (${messageHandler && messageHandler.onlineUsers.length + '/'}${project.perms.length + 1})`}</DialogTitle>
			{editPermsMutation.isLoading && <LinearProgress color="secondary" />}
			<DialogContent style={{ overflow: 'visible', padding: 4 }}>
				<div className="scrollbar" style={{ maxHeight: '30vh', overflowY: 'scroll', overflowX: 'hidden' }}>
					<AnimatePresence>
						{currentUsersList.map((userEntry) => (
							<motion.div
								key={userEntry.id}
								initial="initial"
								animate="animate"
								exit="initial"
								variants={{
									initial: {
										opacity: 0.5,
										height: 0,
									},
									animate: {
										opacity: 1,
										height: 50,
									},
								}}
							>
								<Box display="flex">
									{isOwner && (
										<IconButton color="error" disabled={userEntry.id === -1} onClick={() => removePerm(userEntry.id)}>
											<CloseIcon />
										</IconButton>
									)}
									<ButtonBase
										onClick={() => {
											if (userEntry.permStatus !== 'owner') {
												if (queryEmail === userEntry.user.email!) {
													setValue('email', '');
												} else {
													setValue('email', userEntry.user.email!);
													setValue('canEdit', userEntry.permStatus);
												}
											}
										}}
										style={{ display: 'flex', justifyContent: 'space-around', paddingBlock: '0.8rem', fontSize: '1rem', width: '100%', alignItems: 'center' }}
									>
										<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
											{userEntry.isOnline && (
												<Tooltip title="online">
													<span style={{ background: 'lightgreen', border: '1px solid green', width: '15px', aspectRatio: 1, borderRadius: '50%', display: 'inline-block' }}></span>
												</Tooltip>
											)}

											<span>{userEntry.user.email}</span>
										</div>
										<div>{userEntry.permStatusAsStr}</div>
									</ButtonBase>
								</Box>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
				<Divider style={{ marginBlock: '0.5rem' }} />
				{isOwner && <DialogTitle style={{ paddingBottom: '0' }}>Edit Permissions</DialogTitle>}
				<Box display="flex" alignItems="center" gap={1} sx={{ m: 2 }}>
					{isOwner && (
						<Button size="small" variant="contained" color="secondary" style={{ marginBottom: '1.5rem' }} disabled={editPermsMutation.isLoading} onClick={handleSubmit(onSubmit)}>
							save
						</Button>
					)}
					<Controller
						name="email"
						control={control}
						rules={{
							required: { message: 'this field is required', value: true },
							pattern: {
								message: 'Must be a valid email',
								value: /\S+@\S+\.\S+/,
							},
						}}
						render={({ field, fieldState }) => {
							return (
								<TextField
									{...field}
									onChange={(e) => {
										editPermsMutation.reset();
										field.onChange(e);
									}}
									disabled={editPermsMutation.isLoading}
									error={Boolean(fieldState.error)}
									helperText={fieldState.error?.message || ' '}
									fullWidth
									variant="standard"
									color="primary"
									type="text"
									placeholder="example@example.com"
								/>
							);
						}}
					/>
					{isOwner && (
						<Controller
							name="canEdit"
							defaultValue="viewAndEdit"
							control={control}
							rules={{ required: { message: 'this field is required', value: true } }}
							render={({ field, fieldState }) => {
								return (
									<FormControl sx={{ my: 1, minWidth: '130px' }}>
										<RadioGroup
											{...field}
											onChange={(e) => {
												editPermsMutation.reset();
												field.onChange(e);
											}}
										>
											<FormControlLabel disabled={editPermsMutation.isLoading} value="viewAndEdit" control={<Radio size="small" />} label="View & Edit" />
											<FormControlLabel disabled={editPermsMutation.isLoading} value="viewOnly" control={<Radio size="small" />} label="View Only" />
										</RadioGroup>
										<FormHelperText error>{fieldState.error?.message || ' '}</FormHelperText>
									</FormControl>
								);
							}}
						/>
					)}
				</Box>
				{editPermsMutation.isError && <FormHelperText error>{(editPermsMutation.error as Error).message}</FormHelperText>}
				{editPermsMutation.isSuccess && <FormHelperText color="success">Permissions updated successfully</FormHelperText>}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={handleClose}>
					CLOSE
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProjectPermsDialog;
