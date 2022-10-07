import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { FC } from 'react';
import { UseMutateFunction } from 'react-query';
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
	return (
		<div className={styles.movableTask}>
			<Box display="flex" alignItems="center">
				{task ? (
					<>
						<Checkbox checked={task.done} onChange={(e) => mutate({ type: 'UPDATE_TASK', column_id: column.id, task_id: task.id, update: { done: e.target.checked } })} />
						<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'UPDATE_TASK', column_id: column.id, task_id: task.id, update: { content: text } })} text={task.content} size="small" style={{ textDecoration: task.done ? 'line-through' : 'none' }} />
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
