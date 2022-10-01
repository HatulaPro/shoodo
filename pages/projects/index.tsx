import { NextPage, GetServerSideProps } from 'next';
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const { user, token } = await supabase.auth.api.getUserByCookie(req);

	if (user === null) {
		return { props: {}, redirect: { destination: '/' } };
	}
	supabase.auth.setAuth(token!);

	const projects = await getUserProjects();

	return {
		props: { projects },
	};
};

type ProjectProps = {
	projects: Project[];
};

const ProjectsPage: NextPage<ProjectProps> = ({ projects }) => {
	const router = useRouter();
	const user = useUser();
	if (!user) {
		router.push('/');
	}

	return (
		<Container>
			<Typography sx={{ my: 3 }} variant="h3" component="h1">
				Projects
			</Typography>
			<Box display="flex" flexDirection="row" m={2}>
				<Tooltip title="refresh">
					<IconButton>
						<RefreshIcon />
					</IconButton>
				</Tooltip>
				<Box display="flex" flexDirection="row" justifyContent="end" flex="1">
					<Button size="small" color="secondary" variant="contained">
						NEW
					</Button>
				</Box>
			</Box>
			<ProjectsView projects={projects} />
		</Container>
	);
};

export default ProjectsPage;
