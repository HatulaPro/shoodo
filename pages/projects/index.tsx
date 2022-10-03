import { NextPage, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase/client';
import { getUserProjects, Project } from '../../utils/supabase/projects';
import Container from '@mui/material/Container';
import ProjectsView from '../../components/ProjectsView/ProjectsView';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog';
import { useUserProjects } from '../../hooks/useUserProjects';
import { useShallowRoutes } from '../../hooks/useShallowRoutes';

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
	const router = useRouter();
	const { user, isLoading } = useUser();
	const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);
	const [newProjectIndex, setNewProjectIndex] = useState<number>(-1);
	const {} = useShallowRoutes('/projects', ['/projects', '/projects/new'], isCreateProjectOpen ? 1 : 0);

	const { isLoading: isLoadingProjects, data: userProjects, refetch, manualUpdate } = useUserProjects(user, projects);

	useEffect(() => {
		if (!user && !isLoading) {
			router.push('/');
		}
	}, [user, isLoading]);

	function createNewProject() {
		setIsCreateProjectOpen(true);
	}

	function closeNewProjectDialog(project?: Project) {
		setIsCreateProjectOpen(false);

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
			{user && <NewProjectDialog userId={user.id} open={isCreateProjectOpen} handleClose={closeNewProjectDialog} />}
		</Container>
	);
};

export default ProjectsPage;
