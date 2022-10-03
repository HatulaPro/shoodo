import { NextPage } from 'next';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';

const ProjectByIdPage: NextPage = () => {
	const { user } = useUser({ authOnly: true });
	const { data: project } = useQueryProject(user);

	return <div>{JSON.stringify(project)}</div>;
};

export default ProjectByIdPage;
