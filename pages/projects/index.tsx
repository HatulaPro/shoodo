import { User } from '@supabase/supabase-js';
import { NextPage, GetServerSideProps } from 'next';
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
		props: { user, projects },
	};
};

type ProjectProps = {
	user: User;
	projects: Project[];
};

const ProjectsPage: NextPage<ProjectProps> = ({ user, projects }) => {
	return <code>{JSON.stringify({ user, projects }, null, 4)}</code>;
};

export default ProjectsPage;
