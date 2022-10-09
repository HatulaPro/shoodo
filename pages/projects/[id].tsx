import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import { ProjectKeyboardNavigationProvider } from '../../contexts/ProjectKeyboardNavigationContext';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import { Project } from '../../utils/supabase/projects';
import styles from './Projects.module.css';

function queryToProject(queryProject: any) {
	if (typeof queryProject.id === 'string') {
		return { ...queryProject, id: parseInt(queryProject.id) } as unknown as Project;
	}
	return { ...queryProject } as unknown as Project;
}

const ProjectByIdPage: NextPage = () => {
	const { user } = useUser({ authOnly: true });
	const { query } = useRouter();
	const { data: project, isLoading, manualUpdate, columnsMutation } = useQueryProject(user, query?.project ? queryToProject(query.project) : undefined);
	console.log({ query });

	return (
		<ProjectKeyboardNavigationProvider project={project}>
			<Box position="relative" sx={{ p: { md: 4, sm: 1, xs: 0.5 } }}>
				<Typography variant="h3" component="h2" sx={{ pb: 4 }}>
					{project?.name}
				</Typography>
				<Box display="flex" sx={{ flexDirection: { md: 'row', xs: 'column' } }}>
					{project?.columns && (
						<ColumnsView
							columns={project?.columns}
							setColumns={(cols) => {
								project.columns = [...cols];
								manualUpdate(project);
							}}
							mutate={columnsMutation.mutate}
						/>
					)}
				</Box>
				<Typography variant="body2" component="p" color="GrayText" sx={{ my: 4 }} className={styles.projectsSaving}>
					{isLoading ? 'saving...' : 'saved'}
				</Typography>
			</Box>
		</ProjectKeyboardNavigationProvider>
	);
};

export default ProjectByIdPage;
