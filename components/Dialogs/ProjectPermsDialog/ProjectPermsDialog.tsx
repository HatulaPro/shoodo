import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { FC } from 'react';
import type { Project } from '../../../utils/supabase/projects';

type ProjectPermsDialogProps = {
	open: boolean;
	project: Project;
	handleClose: () => void;
};

const ProjectPermsDialog: FC<ProjectPermsDialogProps> = ({ project, open, handleClose }) => {
	if (!project) return null;

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>{project.name} | Permissions</DialogTitle>
			<DialogContent></DialogContent>
			<DialogActions>
				<Button variant="contained">SAVE</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ProjectPermsDialog;
