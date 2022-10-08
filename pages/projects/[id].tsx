import AddIcon from '@mui/icons-material/PostAdd';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import { useContext } from 'react';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import { ProjectKeyboardNavigationContext, ProjectKeyboardNavigationProvider } from '../../contexts/ProjectKeyboardNavigationContext';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import styles from './Projects.module.css';

const ProjectByIdPage: NextPage = () => {
	const { user } = useUser({ authOnly: true });
	const { data: project, isLoading, manualUpdate, columnsMutation } = useQueryProject(user);
	const position = useContext(ProjectKeyboardNavigationContext);

	return (
		<ProjectKeyboardNavigationProvider project={project}>
			<Box position="relative" sx={{ p: { md: 4, sm: 1, xs: 0.5 } }}>
				<Typography variant="h3" component="h2" sx={{ pb: 4 }}>
					{project?.name}
				</Typography>
				<Box display="flex" sx={{ flexDirection: { md: 'row', xs: 'column' } }}>
					<Box display="flex" sx={{ flexDirection: { md: 'column', xs: 'row' } }} mr={2}>
						<IconButton onClick={() => columnsMutation.mutate({ type: 'CREATE' })}>
							<AddIcon color="primary" fontSize="large" />
						</IconButton>
					</Box>
					{project?.columns && (
						<ColumnsView
							columns={project?.columns}
							setColumns={(cols) => {
								project.columns = [...cols];
								manualUpdate(project);
							}}
							mutate={columnsMutation.mutate}
						/>
					)}
				</Box>
				<Typography variant="body2" component="p" color="GrayText" sx={{ my: 4 }} className={styles.projectsSaving}>
					{isLoading ? 'saving...' : 'saved'}
				</Typography>
			</Box>
		</ProjectKeyboardNavigationProvider>
	);
};

export default ProjectByIdPage;
