import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { FC } from 'react';
import { useContext } from 'react';
import type { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';

type ColumnsToolsProps = {
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
};

const ColumnsTools: FC<ColumnsToolsProps> = ({ mutate }) => {
	const register = useContext(ProjectKeyboardNavigationContext);

	return (
		<Box display="flex" sx={{ flexDirection: { md: 'column', xs: 'row' } }} mr={2}>
			<IconButton onClick={() => mutate({ type: 'CREATE' })} {...register(-1, 0)}>
				<AddIcon color="primary" fontSize="large" />
			</IconButton>
			<IconButton {...register(-1, 1)}>
				<GroupIcon color="warning" fontSize="large" />
			</IconButton>
		</Box>
	);
};

export default ColumnsTools;
