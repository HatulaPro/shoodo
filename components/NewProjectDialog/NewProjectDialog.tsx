import { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import LogoSvg from '../LogoSvg/LogoSvg';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useForm, Controller } from 'react-hook-form';
import { Project, createProject } from '../../utils/supabase/projects';
import { useMutation } from 'react-query';

type NewProjectDialogProps = {
	userId: string;
	open: boolean;
	handleClose: (project?: Project) => void;
};

interface DialogForm {
	name: string;
	description: string;
}

const NewProjectDialog: FC<NewProjectDialogProps> = ({ userId, open, handleClose }) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const { control, handleSubmit, reset } = useForm<DialogForm>();

	const { isLoading, isError, mutateAsync } = useMutation(async (data: DialogForm) => {
		const proj = await createProject(userId, data.name, data.description);
		handleClose(proj);
		reset();
		return proj;
	});

	function onSubmit(data: DialogForm) {
		mutateAsync(data);
	}

	return (
		<Dialog open={open} onClose={() => handleClose()} maxWidth="md" fullWidth fullScreen={isSmallScreen} disableEscapeKeyDown>
			<DialogTitle style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
				<LogoSvg />
				New Project
			</DialogTitle>
			{isLoading && <LinearProgress color="secondary" />}
			<DialogContent>
				<Controller
					name="name"
					control={control}
					rules={{
						required: { message: 'this field is required', value: true },
						minLength: { message: 'Project name must be at least 4 characters long', value: 4 },
					}}
					render={({ field, fieldState }) => {
						return <TextField {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} disabled={isLoading} autoFocus margin="dense" label="Project Name" type="text" fullWidth variant="standard" />;
					}}
				/>
				<Controller
					name="description"
					control={control}
					rules={{
						required: { message: 'this field is required', value: true },
						minLength: { message: 'Project description must be at least 4 characters long', value: 4 },
					}}
					render={({ field, fieldState }) => {
						return <TextField {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} disabled={isLoading} margin="dense" label="Description" placeholder="A short description of your awesome project..." type="text" multiline rows={6} fullWidth variant="standard" />;
					}}
				/>

				{isError && <Alert severity="error">An error has occured, please try again</Alert>}
			</DialogContent>
			<DialogActions>
				<Button disabled={isLoading} onClick={() => handleClose()}>
					Cancel
				</Button>
				<Button disabled={isLoading} onClick={handleSubmit(onSubmit)}>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default NewProjectDialog;
