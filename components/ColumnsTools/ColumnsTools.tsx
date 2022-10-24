import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { FC } from 'react';
import type { UseMutateFunction } from 'react-query';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
import useRealtimeProject from '../../hooks/useRealtimeProject';
import { useShallowRoutes } from '../../hooks/useShallowRoutes';
import { MessageHandlerContext } from '../../pages/projects/[id]';
import type { FullProject } from '../../utils/supabase/projects';
import ChatDialog from '../Dialogs/ChatDialog/ChatDialog';
import ProjectPermsDialog from '../Dialogs/ProjectPermsDialog/ProjectPermsDialog';

type ColumnsToolsProps = {
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	manualUpdate: (newProject: FullProject) => void;
	project?: FullProject;
	editPerms: boolean;
};

const ColumnsTools: FC<ColumnsToolsProps> = ({ mutate, project, manualUpdate, editPerms }) => {
	const messageHandler = useRealtimeProject(project, manualUpdate);
	const { location, setLocation } = useShallowRoutes<'/chat' | '/social'>(`/projects/${project?.id || '12'}`);

	return (
		<MessageHandlerContext.Provider value={messageHandler}>
			<Box display="flex" flexDirection="row" mr={2}>
				{editPerms && (
					<IconButton onClick={() => mutate({ type: 'CREATE' })} aria-label="Add Column">
						<AddIcon color="primary" fontSize="large" />
					</IconButton>
				)}
				<IconButton onClick={() => setLocation('/social')} aria-label="View Permissions">
					<GroupIcon color="warning" fontSize="large" />
				</IconButton>
				{messageHandler && (
					<IconButton
						onClick={() => {
							setLocation('/chat');
							messageHandler!.clearMessages();
						}}
						aria-label="Open Chat"
					>
						<Badge badgeContent={location === '/chat' ? 0 : messageHandler.unread} color="secondary">
							<ChatIcon color="success" fontSize="large" />
						</Badge>
					</IconButton>
				)}
			</Box>
			{project && (
				<>
					<ProjectPermsDialog open={location === '/social'} manualUpdate={manualUpdate} handleClose={() => setLocation(null)} project={project} />

					{messageHandler && (
						<ChatDialog
							open={location === '/chat'}
							handleClose={() => {
								setLocation(null);
								messageHandler.clearMessages();
							}}
							project_name={project.name}
						/>
					)}
				</>
			)}
		</MessageHandlerContext.Provider>
	);
};

export default ColumnsTools;
