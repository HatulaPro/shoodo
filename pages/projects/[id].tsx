import { NextPage } from 'next';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useMutation } from 'react-query';
import { Column, Project, updateColumnById } from '../../utils/supabase/projects';

export type ColumnMutateArgs = {
	column_id: number;
	update: Partial<Column>;
};
const ProjectByIdPage: NextPage = () => {
	const { user } = useUser({ authOnly: true });
	const { data: project, manualUpdate } = useQueryProject(user);

	const { isLoading, mutate: mutateColumn } = useMutation((args: ColumnMutateArgs) => {
		return updateColumnById(args.column_id, args.update).then((column) => {
			const index = project!.columns!.findIndex((col) => col.id === column.id);
			project!.columns![index] = column;
			manualUpdate(project!);
		});
	});

	return (
		<Box p={4}>
			<Typography variant="h3" component="h2" sx={{ pb: 4 }}>
				{project?.name}
			</Typography>
			{project?.columns && <ColumnsView columns={project?.columns} mutate={mutateColumn} />}
			<Typography variant="body2" component="p" sx={{ my: 4 }}>
				{isLoading ? 'saving...' : 'saved'}
			</Typography>
		</Box>
	);
};

export default ProjectByIdPage;
