import { NextPage } from 'next';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useMutation } from 'react-query';
import { Column, Project, updateColumnById, createColumn } from '../../utils/supabase/projects';
import AddIcon from '@mui/icons-material/PostAdd';
import styles from './Projects.module.css';

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
			project!.columns = [...project!.columns!];
			manualUpdate(project!);
		});
	});

	async function addColumn() {
		const bestImportance = Math.min(...project!.columns!.map((column) => column.importance));
		createColumn(project!.id, bestImportance - Math.pow(2, 32)).then((col: Column) => {
			project!.columns = [col, ...project!.columns!];
			manualUpdate(project!);
			console.log(project!.columns);
		});
	}

	return (
		<Box p={4} position="relative">
			<Typography variant="h3" component="h2" sx={{ pb: 4 }}>
				{project?.name}
			</Typography>
			<Box display="flex" sx={{ flexDirection: { md: 'row', xs: 'column' } }}>
				<Box display="flex" sx={{ flexDirection: { md: 'column', xs: 'row' } }} mr={2}>
					<IconButton onClick={addColumn}>
						<AddIcon color="primary" fontSize="large" />
					</IconButton>
				</Box>
				{project?.columns && (
					<ColumnsView
						columns={project?.columns}
						setColumns={(cols) => {
							project.columns = [...cols];
							manualUpdate(project);
						}}
						mutate={mutateColumn}
					/>
				)}
			</Box>
			<Typography variant="body2" component="p" color="GrayText" sx={{ my: 4 }} className={styles.projectsSaving}>
				{isLoading ? 'saving...' : 'saved'}
			</Typography>
		</Box>
	);
};

export default ProjectByIdPage;
