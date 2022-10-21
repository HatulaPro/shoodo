import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { FC } from 'react';
import { useContext, useState } from 'react';
import type { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
import type { MessageHandler } from '../../hooks/useRealtimeProject';
import type { FullProject } from '../../utils/supabase/projects';
import ChatDialog from '../Dialogs/ChatDialog/ChatDialog';
import ProjectPermsDialog from '../Dialogs/ProjectPermsDialog/ProjectPermsDialog';

type ColumnsToolsProps = {
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	manualUpdate: (newProject: FullProject) => void;
	project?: FullProject;
	editPerms: boolean;
	messageHandler: MessageHandler;
};

const ColumnsTools: FC<ColumnsToolsProps> = ({ mutate, project, manualUpdate, editPerms, messageHandler }) => {
	const register = useContext(ProjectKeyboardNavigationContext);
	const [projectPermsOpen, setProjectPermsOpen] = useState<boolean>(false);
	const [chatOpen, setChatOpen] = useState<boolean>(false);

	return (
		<>
			<Box display="flex" sx={{ flexDirection: { md: 'column', xs: 'row' } }} mr={2}>
				{editPerms && (
					<IconButton onClick={() => mutate({ type: 'CREATE' })} {...register(-1, 0)} aria-label="Add Column">
						<AddIcon color="primary" fontSize="large" />
					</IconButton>
				)}
				<IconButton onClick={() => setProjectPermsOpen(true)} {...register(-1, 1)} aria-label="View Permissions">
					<GroupIcon color="warning" fontSize="large" />
				</IconButton>
				<IconButton
					onClick={() => {
						setChatOpen(true);
						messageHandler.clearMessages();
					}}
					aria-label="Open Chat"
				>
					<Badge badgeContent={chatOpen ? 0 : messageHandler.unread} color="secondary">
						<ChatIcon color="success" fontSize="large" />
					</Badge>
				</IconButton>
			</Box>
			{projectPermsOpen && project && <ProjectPermsDialog open={projectPermsOpen} manualUpdate={manualUpdate} handleClose={() => setProjectPermsOpen(false)} project={project} />}
			{project && (
				<ChatDialog
					open={chatOpen}
					handleClose={() => {
						setChatOpen(false);
						messageHandler.clearMessages();
					}}
					messages={messageHandler.messages}
					sendMessage={messageHandler.sendMessage}
					project_name={project.name}
				/>
			)}
		</>
	);
};

export default ColumnsTools;
