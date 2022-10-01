import { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LogoSvg from '../LogoSvg/LogoSvg';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type NewProjectDialogProps = {
	userId: string;
	open: boolean;
	handleClose: () => void;
};
const NewProjectDialog: FC<NewProjectDialogProps> = ({ userId, open, handleClose }) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth fullScreen={isSmallScreen} disableEscapeKeyDown>
			<DialogTitle style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
				<LogoSvg />
				New Project
			</DialogTitle>
			<DialogContent>
				<TextField autoFocus margin="dense" label="Project Name" type="text" fullWidth variant="standard" />
				<TextField autoFocus margin="dense" label="Description" placeholder="A short description of your awesome project..." type="text" multiline rows={6} fullWidth variant="standard" />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleClose}>Create</Button>
			</DialogActions>
		</Dialog>
	);
};

export default NewProjectDialog;
