import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import type { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import type { Project } from '../../../utils/supabase/projects';

type ProjectPermsDialogProps = {
	open: boolean;
	project: Project;
	handleClose: () => void;
};

interface AddUserForm {
	email: string;
	canEdit: 'viewAndEdit' | 'viewOnly';
}

const ProjectPermsDialog: FC<ProjectPermsDialogProps> = ({ project, open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm<AddUserForm>();
	const theme = useTheme();

	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const editPermsMutation = useMutation(
		async (data: AddUserForm) => {
			const res = await fetch('/api/editPerms', {
				method: 'POST',
				headers: new Headers({ 'Content-Type': 'application/json' }),
				credentials: 'same-origin',
				body: JSON.stringify({ ...data, projectId: project.id }),
			});
			const jsoned = await res.json();
			if (jsoned.success) {
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

	function onSubmit(data: AddUserForm) {
		editPermsMutation.mutate(data);
	}

	return (
		<Dialog open={open} onClose={handleClose} fullWidth={!isSmallScreen} fullScreen={isSmallScreen}>
			<DialogTitle>Edit Permissions{project.perms && ` (${project.perms.length})`}</DialogTitle>
			{editPermsMutation.isLoading && <LinearProgress color="secondary" />}
			<DialogContent style={{ overflow: 'visible', padding: 4 }}>
				{project.perms?.map((perm) => (
					<div>
						{perm.user.email} | {perm.can_edit ? 'View & Edit' : 'View Only'}
					</div>
				))}
				<Box display="flex" alignItems="center" gap={1}>
					<IconButton size="small" color="primary" disabled={editPermsMutation.isLoading} onClick={handleSubmit(onSubmit)}>
						<AddIcon />
					</IconButton>
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
							return <TextField {...field} disabled={editPermsMutation.isLoading} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth variant="outlined" color="primary" type="text" placeholder="example@example.com" label="Your buddy's email" />;
						}}
					/>
					<Controller
						name="canEdit"
						control={control}
						rules={{ required: { message: 'this field is required', value: true } }}
						render={({ field, fieldState }) => {
							return (
								<FormControl sx={{ my: 1, minWidth: '130px' }}>
									<Select {...field} disabled={editPermsMutation.isLoading} error={Boolean(fieldState.error)} variant="outlined">
										<MenuItem value="viewAndEdit">View & Edit</MenuItem>
										<MenuItem value="viewOnly">View Only</MenuItem>
									</Select>
									{fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
								</FormControl>
							);
						}}
					/>
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
