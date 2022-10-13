import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import NewProjectDialog from '../../components/Dialogs/NewProjectDialog/NewProjectDialog';
import ProjectsView from '../../components/ProjectsView/ProjectsView';
import { useShallowRoutes } from '../../hooks/useShallowRoutes';
import { useUser } from '../../hooks/useUser';
import { useUserProjects } from '../../hooks/useUserProjects';
import type { Project } from '../../utils/supabase/projects';

type ProjectProps = {
	projects: Project[];
};

const ProjectsPage: NextPage<ProjectProps> = () => {
	const { user } = useUser({ authOnly: true });
	const [newProjectIndex, setNewProjectIndex] = useState<number>(-1);
	const { location, setLocation } = useShallowRoutes<'/projects/new' | '/projects'>('/projects');

	const { isLoading: isLoadingProjects, data: userProjects, refetch, manualUpdate } = useUserProjects(user);

	function createNewProject() {
		setLocation('/projects/new');
	}

	function closeNewProjectDialog(project?: Project) {
		setLocation('/projects');

		if (project) {
			setNewProjectIndex(userProjects!.length);
			manualUpdate([...userProjects!, project]);
		}
	}

	return (
		<>
			<Head>
				<title>Shoodo | My Projects</title>
			</Head>
			<Container>
				<Typography sx={{ my: 3 }} variant="h3" component="h1">
					Projects
				</Typography>
				<Box display="flex" flexDirection="row" m={2}>
					<Tooltip title="refresh">
						<IconButton onClick={() => refetch()} disabled={isLoadingProjects}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
					<Box display="flex" flexDirection="row" justifyContent="end" flex="1">
						<Button size="small" color="secondary" variant="contained" onClick={createNewProject}>
							NEW
						</Button>
					</Box>
				</Box>
				{userProjects && <ProjectsView projects={userProjects} newProject={newProjectIndex} updateProjects={manualUpdate} />}
				{user && <NewProjectDialog userId={user.id} open={location === '/projects/new'} handleClose={closeNewProjectDialog} />}
			</Container>
		</>
	);
};

export default ProjectsPage;
