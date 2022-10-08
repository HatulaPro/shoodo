import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { FC, useContext } from 'react';
import { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { Column, Task } from '../../utils/supabase/projects';
import EditableTypography from '../EditableTypography/EditableTypography';
import styles from './MovableTask.module.css';

type MovableTaskProps =
	| {
			task: Task;
			column: Column;
			mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	  }
	| {
			task?: undefined;
			column: Column;
			mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	  };

const MovableTask: FC<MovableTaskProps> = ({ task, column, mutate }) => {
	const { column_id: activeColumnId, task_id: activeTaskId, util_column_id: utilColumnId } = useContext(ProjectKeyboardNavigationContext);

	const isHighLighted = (utilColumnId === column.id && activeColumnId === null && activeTaskId === null && !task) || task?.id === activeTaskId;

	return (
		<div className={styles.movableTask} style={{ backgroundColor: isHighLighted ? '#c7c7c7' : '' }}>
			<Box display="flex" alignItems="center">
				{task ? (
					<>
						<Checkbox checked={task.done} onChange={(e) => mutate({ type: 'UPDATE_TASK', column_id: column.id, task_id: task.id, update: { done: e.target.checked } })} />
						<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'UPDATE_TASK', column_id: column.id, task_id: task.id, update: { content: text } })} text={task.content} size="small" style={{ textDecoration: task.done ? 'line-through' : 'none' }} />
						<IconButton onClick={() => mutate({ type: 'DELETE_TASK', column_id: column.id, task_id: task.id })}>
							<CloseIcon htmlColor="red" />
						</IconButton>
					</>
				) : (
					<>
						<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'ADD_TASK', column_id: column.id, content: text })} text="Add New..." size="small" placeholder />
					</>
				)}
			</Box>
		</div>
	);
};

export default MovableTask;
