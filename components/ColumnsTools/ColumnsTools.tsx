import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { FC } from 'react';
import { useContext, useState } from 'react';
import type { UseMutateFunction } from 'react-query';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
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
	const [projectPermsOpen, setProjectPermsOpen] = useState<boolean>(false);
	const [chatOpen, setChatOpen] = useState<boolean>(false);
	const messageHandler = useContext(MessageHandlerContext);

	return (
		<>
			<Box display="flex" flexDirection="row" mr={2}>
				{editPerms && (
					<IconButton onClick={() => mutate({ type: 'CREATE' })} aria-label="Add Column">
						<AddIcon color="primary" fontSize="large" />
					</IconButton>
				)}
				<IconButton onClick={() => setProjectPermsOpen(true)} aria-label="View Permissions">
					<GroupIcon color="warning" fontSize="large" />
				</IconButton>
				{messageHandler && (
					<IconButton
						onClick={() => {
							setChatOpen(true);
							messageHandler!.clearMessages();
						}}
						aria-label="Open Chat"
					>
						<Badge badgeContent={chatOpen ? 0 : messageHandler.unread} color="secondary">
							<ChatIcon color="success" fontSize="large" />
						</Badge>
					</IconButton>
				)}
			</Box>
			{project && (
				<>
					<ProjectPermsDialog open={projectPermsOpen} manualUpdate={manualUpdate} handleClose={() => setProjectPermsOpen(false)} project={project} />

					{messageHandler && (
						<ChatDialog
							open={chatOpen}
							handleClose={() => {
								setChatOpen(false);
								messageHandler.clearMessages();
							}}
							project_name={project.name}
						/>
					)}
				</>
			)}
		</>
	);
};

export default ColumnsTools;
