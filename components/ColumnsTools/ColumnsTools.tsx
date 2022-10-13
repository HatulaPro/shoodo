import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { FC } from 'react';
import { useContext, useState } from 'react';
import type { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
import type { Project } from '../../utils/supabase/projects';
import ProjectPermsDialog from '../Dialogs/ProjectPermsDialog/ProjectPermsDialog';

type ColumnsToolsProps = {
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	project?: Project;
};

const ColumnsTools: FC<ColumnsToolsProps> = ({ mutate, project }) => {
	const register = useContext(ProjectKeyboardNavigationContext);
	const [projectPermsOpen, setProjectPermsOpen] = useState<boolean>(false);

	return (
		<>
			<Box display="flex" sx={{ flexDirection: { md: 'column', xs: 'row' } }} mr={2}>
				<IconButton onClick={() => mutate({ type: 'CREATE' })} {...register(-1, 0)}>
					<AddIcon color="primary" fontSize="large" />
				</IconButton>
				<IconButton onClick={() => setProjectPermsOpen(true)} {...register(-1, 1)}>
					<GroupIcon color="warning" fontSize="large" />
				</IconButton>
			</Box>
			{project && <ProjectPermsDialog open={projectPermsOpen} handleClose={() => setProjectPermsOpen(false)} project={project} />}
		</>
	);
};

export default ColumnsTools;
