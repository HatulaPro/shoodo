import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import ColumnsTools from '../../components/ColumnsTools/ColumnsTools';
import ColumnsView from '../../components/ColumnsView/ColumnsView';
import EditableTypography from '../../components/EditableTypography/EditableTypography';
import { useQueryProject } from '../../hooks/useQueryProject';
import useRealtimeProject, { MessageHandler } from '../../hooks/useRealtimeProject';
import { useUser } from '../../hooks/useUser';
import { setHistory } from '../../utils/supabase/history';
import { updateProjectById } from '../../utils/supabase/projects';

export const MessageHandlerContext = createContext<MessageHandler | null>(null);

const ProjectByIdPage: NextPage = () => {
	const { user, isLoading: isLoadingUser } = useUser({ authOnly: true });
	const router = useRouter();
	const { data: project, manualUpdate, columnsMutation, isLoading: isLoadingProject } = useQueryProject(user);
	useQuery(['history', project?.id, user?.id], () => setHistory(project!.id, user!.id), { refetchInterval: 1000 * 60 * 3, refetchOnWindowFocus: false, enabled: Boolean(project && user) });

	const [hasEditPerms, hasViewingPerms] = useMemo(() => {
		if (isLoadingUser || isLoadingProject) return [false, true];
		if (!project || !user) return [false, true];

		const isOwner = project.user_id === user.id;
		if (isOwner) return [true, true];

		const userPerm = project.perms?.find((p) => p.guest_id === user?.id);
		if (!userPerm) return [false, false];

		return [userPerm.can_edit, userPerm !== undefined];
	}, [user, project?.perms, project?.user_id, isLoadingProject, isLoadingUser]);

	const messageHandler = useRealtimeProject(project, manualUpdate);
	console.log({ hasEditPerms, hasViewingPerms, project, user });
	if (!hasViewingPerms && !isLoadingUser && !isLoadingProject) {
		router.push('/');
	}

	return (
		<MessageHandlerContext.Provider value={messageHandler}>
			<Head>
				<title>Shoodo | Project View</title>
			</Head>
			<Box position="relative" sx={{ p: { md: 2, sm: 1, xs: 0.5 } }}>
				{project && (
					<>
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
								padding: '0.2rem',
								paddingBottom: '0',
								lineHeight: '4rem',
							}}
							disabled={!hasEditPerms}
						/>
						<EditableTypography
							onUpdate={(text) => {
								if (text.length > 0) {
									updateProjectById(project.id, { description: text });
									manualUpdate({ ...project, description: text });
								}
							}}
							size="small"
							style={{
								padding: '0.5rem',
								paddingTop: '0',
								lineHeight: '2rem',
							}}
							text={project.description}
							disabled={!hasEditPerms}
						/>
						<Typography
							style={{
								padding: '0.5rem',
								paddingTop: '0',
							}}
							variant="subtitle2"
							color="GrayText"
						>
							By {project.user?.email}
						</Typography>
					</>
				)}
				<Box display="flex" flexDirection="column">
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
			</Box>
		</MessageHandlerContext.Provider>
	);
};

export default ProjectByIdPage;
