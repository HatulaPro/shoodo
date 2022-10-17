import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { FC, useContext } from 'react';
import type { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
import type { Column, Task } from '../../utils/supabase/projects';
import EditableTypography from '../EditableTypography/EditableTypography';
import styles from './MovableTask.module.css';

type MovableTaskProps =
	| {
			task: Task;
			column: Column;
			mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
			editPerms: boolean;
	  }
	| {
			task?: undefined;
			column: Column;
			mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
			editPerms: boolean;
	  };

const MovableTask: FC<MovableTaskProps> = ({ task, column, mutate, editPerms }) => {
	const register = useContext(ProjectKeyboardNavigationContext);

	return (
		<div className={styles.movableTask} {...register(column.id, task?.id || null)}>
			<Box display="flex" alignItems="center">
				{task ? (
					<>
						{editPerms && <Checkbox checked={task.done} onChange={(e) => mutate({ type: 'UPDATE_TASK', column_id: column.id, task_id: task.id, update: { done: e.target.checked } })} />}
						<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'UPDATE_TASK', column_id: column.id, task_id: task.id, update: { content: text } })} text={task.content} size="small" style={{ textDecoration: task.done ? 'line-through' : 'none' }} disabled={!editPerms} />
						{editPerms && (
							<IconButton onClick={() => mutate({ type: 'DELETE_TASK', column_id: column.id, task_id: task.id })}>
								<CloseIcon htmlColor="red" />
							</IconButton>
						)}
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
