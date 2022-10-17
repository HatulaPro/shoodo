import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo } from 'react';
import ColumnsTools from '../../components/ColumnsTools/ColumnsTools';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import EditableTypography from '../../components/EditableTypography/EditableTypography';
import { ProjectKeyboardNavigationProvider } from '../../contexts/ProjectKeyboardNavigationContext';
import { useQueryProject } from '../../hooks/useQueryProject';
import { useUser } from '../../hooks/useUser';
import styles from '../../styles/Projects.module.css';
import { updateProjectById } from '../../utils/supabase/projects';

const ProjectByIdPage: NextPage = () => {
	const { user } = useUser({ authOnly: true });
	const { data: project, isLoading, manualUpdate, columnsMutation } = useQueryProject(user);
	const hasEditPerms = useMemo(() => project?.user_id === user?.id || Boolean(project?.perms?.find((p) => p.guest_id === user?.id && p.can_edit)), [user, project?.perms, project?.user_id]);

	return (
		<ProjectKeyboardNavigationProvider project={project}>
			<Head>
				<title>Shoodo | Project View</title>
			</Head>
			<Box position="relative" sx={{ p: { md: 4, sm: 1, xs: 0.5 } }}>
				{project && (
					<EditableTypography
						onUpdate={(text) => {
							if (text.length > 0) {
								updateProjectById(project.id, { name: text });
								manualUpdate({ ...project, name: text });
							}
						}}
						size="large"
						text={project.name}
						style={{
							fontSize: '1.6rem',
							padding: '0.5rem',
							lineHeight: '4rem',
						}}
						disabled={!hasEditPerms}
					/>
				)}
				<Box display="flex" sx={{ flexDirection: { md: 'row', xs: 'column' } }}>
					<ColumnsTools project={project} mutate={columnsMutation.mutate} manualUpdate={manualUpdate} editPerms={hasEditPerms} />
					{project?.columns && (
						<ColumnsView
							columns={project?.columns}
							setColumns={(cols) => {
								project.columns = [...cols];
								manualUpdate(project);
							}}
							mutate={columnsMutation.mutate}
							editPerms={hasEditPerms}
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
