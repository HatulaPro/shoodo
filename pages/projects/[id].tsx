import { NextPage } from 'next';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ProjectByIdPage: NextPage = () => {
	const { user } = useUser({ authOnly: true });
	const { data: project } = useQueryProject(user);
	return (
		<Box p={4}>
			<Typography variant="h3" component="h2" sx={{ pb: 4 }}>
				{project?.name}
			</Typography>
			{project?.columns && <ColumnsView columns={project?.columns} />}
		</Box>
	);
};

export default ProjectByIdPage;
