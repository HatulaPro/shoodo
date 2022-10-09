import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog';
import ProjectsView from '../../components/ProjectsView/ProjectsView';
import { useShallowRoutes } from '../../hooks/useShallowRoutes';
import { useUser } from '../../hooks/useUser';
import { useUserProjects } from '../../hooks/useUserProjects';
import { supabase } from '../../utils/supabase/client';
import type { Project } from '../../utils/supabase/projects';
import { getUserProjects } from '../../utils/supabase/projects';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const { user, token } = await supabase.auth.api.getUserByCookie(req);

	if (user === null) {
		return { props: {}, redirect: { destination: '/' } };
	}
	supabase.auth.setAuth(token!);

	const projects = await getUserProjects(user.id);

	return {
		props: { projects },
	};
};

type ProjectProps = {
	projects: Project[];
};

const ProjectsPage: NextPage<ProjectProps> = ({ projects }) => {
	const { user } = useUser({ authOnly: true });
	const [newProjectIndex, setNewProjectIndex] = useState<number>(-1);
	const { location, setLocation } = useShallowRoutes<'/projects/new' | '/projects'>('/projects');

	const { isLoading: isLoadingProjects, data: userProjects, refetch, manualUpdate } = useUserProjects(user, projects);

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
		<Container>
			<Typography sx={{ my: 3 }} variant="h3" component="h1">
				Projects
			</Typography>
			<Box display="flex" flexDirection="row" m={2}>
				<Tooltip title="refresh">
					<IconButton onClick={refetch} disabled={isLoadingProjects}>
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
	);
};

export default ProjectsPage;
