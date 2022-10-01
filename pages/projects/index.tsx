import { User } from '@supabase/supabase-js';
import { NextPage, GetServerSideProps } from 'next';
import { supabase } from '../../utils/supabase/client';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const { user } = await supabase.auth.api.getUserByCookie(req);

	if (user === null) {
		return { props: {}, redirect: { destination: '/' } };
	}

	return {
		props: { user },
	};
};

type ProjectProps = {
	user: User | null;
};

const ProjectsPage: NextPage<ProjectProps> = ({ user }) => {
	return <div>{JSON.stringify(user, null, 4)}</div>;
};

export default ProjectsPage;
