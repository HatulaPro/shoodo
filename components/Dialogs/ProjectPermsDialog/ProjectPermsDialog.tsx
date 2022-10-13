import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
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
	const { control, handleSubmit } = useForm<AddUserForm>();

	const editPermsMutation = useMutation(async (data: AddUserForm) => {
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
	});

	function onSubmit(data: AddUserForm) {
		editPermsMutation.mutate(data);
	}

	return (
		<Dialog open={open} onClose={handleClose} fullWidth>
			<DialogTitle>Edit Permissions</DialogTitle>
			{editPermsMutation.isLoading && <LinearProgress color="secondary" />}
			<DialogContent style={{ overflow: 'visible' }}>
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
						return <TextField {...field} disabled={editPermsMutation.isLoading || editPermsMutation.isSuccess} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth variant="outlined" color="primary" type="text" placeholder="example@example.com" label="Your buddy's email" />;
					}}
				/>
				<Controller
					name="canEdit"
					control={control}
					rules={{ required: { message: 'this field is required', value: true } }}
					render={({ field, fieldState }) => {
						return (
							<FormControl sx={{ my: 1, minWidth: 200 }}>
								<InputLabel id="select-perms-label">permissions</InputLabel>
								<Select {...field} id="select-perms-label" disabled={editPermsMutation.isLoading || editPermsMutation.isSuccess} error={Boolean(fieldState.error)} labelId="select-perms-label" variant="outlined" label="permissions">
									<MenuItem value="viewAndEdit">View & Edit</MenuItem>
									<MenuItem value="viewOnly">View Only</MenuItem>
								</Select>
								{fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
							</FormControl>
						);
					}}
				/>
				{editPermsMutation.isError && <FormHelperText error>{(editPermsMutation.error as Error).message}</FormHelperText>}
				{editPermsMutation.isSuccess && <FormHelperText color="success">Permissions updated successfully</FormHelperText>}
			</DialogContent>
			<DialogActions>
				{editPermsMutation.isSuccess ? (
					<Button variant="contained" color="success" onClick={handleClose}>
						CLOSE
					</Button>
				) : (
					<Button variant="contained" disabled={editPermsMutation.isLoading} onClick={handleSubmit(onSubmit)}>
						SAVE
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default ProjectPermsDialog;
