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

	function onSubmit(data: AddUserForm) {}

	return (
		<Dialog open={open} onClose={handleClose} fullWidth>
			<DialogTitle>Edit Permissions</DialogTitle>
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
						return <TextField {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} fullWidth variant="outlined" color="primary" type="text" placeholder="example@example.com" label="Your buddy's email" />;
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
								<Select {...field} id="select-perms-label" error={Boolean(fieldState.error)} labelId="select-perms-label" variant="outlined" label="permissions">
									<MenuItem value="viewAndEdit">View & Edit</MenuItem>
									<MenuItem value="editOnly">Edit Only</MenuItem>
								</Select>
								{fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
							</FormControl>
						);
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={handleSubmit(onSubmit)}>
					SAVE
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProjectPermsDialog;
