import { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useUser } from '../../hooks/useUser';
import { supabase } from '../../utils/supabase/client';
import { getUserProjects, Project } from '../../utils/supabase/projects';

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

	return <code>{JSON.stringify({ user, projects }, null, 4)}</code>;
};

export default ProjectsPage;
