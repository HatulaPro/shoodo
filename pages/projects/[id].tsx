import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import { useEffect } from 'react';

const ProjectByIdPage: NextPage = () => {
	const { user, isLoading } = useUser();
	const router = useRouter();
	const { data: project } = useQueryProject(user);

	useEffect(() => {
		if (!user && !isLoading) {
			router.push('/');
		}
	}, [user, isLoading, router]);

	return <div>{JSON.stringify(project)}</div>;
};

export default ProjectByIdPage;
