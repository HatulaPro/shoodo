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
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import type { FC } from 'react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useUser } from '../../../hooks/useUser';
import type { Perm } from '../../../utils/supabase/perms';
import type { Project } from '../../../utils/supabase/projects';

type ProjectPermsDialogProps = {
	open: boolean;
	project: Project;
	handleClose: () => void;
	manualUpdate: (newProject: Project) => void;
};

interface AddUserForm {
	email: string;
	canEdit: 'viewAndEdit' | 'viewOnly';
}

const ProjectPermsDialog: FC<ProjectPermsDialogProps> = ({ project, open, handleClose, manualUpdate }) => {
	const { user } = useUser();
	const isOwner = Boolean(user) && user?.id === project?.user_id;
	const { control, handleSubmit, reset, watch, setValue } = useForm<AddUserForm>();
	const theme = useTheme();

	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const editPermsMutation = useMutation(
		async (data: AddUserForm) => {
			if (!isOwner) return;

			const res = await fetch('/api/perms/editPerm', {
				method: 'POST',
				headers: new Headers({ 'Content-Type': 'application/json' }),
				credentials: 'same-origin',
				body: JSON.stringify({ ...data, projectId: project.id }),
			});
			const jsoned = await res.json();
			if (jsoned.success) {
				const result = jsoned.data as Perm;
				project.perms = [result, ...project.perms!.filter((p) => p.id !== result.id)];
				manualUpdate(project);
				return true;
			} else {
				throw new Error(jsoned.error);
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
		project.perms = project.perms!.filter((p) => p.id !== permId);
		manualUpdate(project);
	}

	function onSubmit(data: AddUserForm) {
		editPermsMutation.mutate(data);
	}

	const queryEmail = watch('email');

	const currentUsersList = useMemo<Perm[]>(() => {
		return project.perms?.filter((perm) => (queryEmail ? perm.user!.email.toLowerCase().includes(queryEmail.toLowerCase()) : true)) || [];
	}, [queryEmail, project?.perms]);

	return (
		<Dialog open={open} onClose={handleClose} fullWidth={!isSmallScreen} fullScreen={isSmallScreen}>
			<DialogTitle>
				{isOwner && 'Edit '}Permissions{project.perms && ` (${project.perms.length})`}
			</DialogTitle>
			{editPermsMutation.isLoading && <LinearProgress color="secondary" />}
			<DialogContent style={{ overflow: 'visible', padding: 4 }}>
				<Typography variant="caption" style={{ padding: '0.5rem' }}>
					owned and managed by <b>{project?.user?.email}</b> {isOwner && '(you)'}
				</Typography>

				<div className="scrollbar" style={{ maxHeight: '30vh', overflowY: 'scroll', overflowX: 'hidden' }}>
					<AnimatePresence>
						{currentUsersList.map((perm) => (
							<motion.div
								key={perm.id}
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
										<IconButton onClick={() => removePerm(perm.id)}>
											<CloseIcon color="error" />
										</IconButton>
									)}
									<ButtonBase
										onClick={() => {
											setValue('email', perm.user.email);
											setValue('canEdit', perm.can_edit ? 'viewAndEdit' : 'viewOnly');
										}}
										style={{ display: 'flex', justifyContent: 'space-around', paddingBlock: '0.8rem', fontSize: '1rem', width: '100%' }}
									>
										<div>{perm.user.email}</div>
										<div>{perm.can_edit ? 'View & Edit' : 'View Only'}</div>
									</ButtonBase>
								</Box>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
				<Divider style={{ marginBlock: '0.5rem' }} />
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
