import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { FC, useMemo } from 'react';
import type { UseMutateFunction } from 'react-query';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
import type { Task } from '../../utils/supabase/projects';
import EditableTypography from '../EditableTypography/EditableTypography';
import styles from './MovableTask.module.css';

type MovableTaskProps = {
	task?: Task;
	column_id: number;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	editPerms: boolean;
};

const MovableTask: FC<MovableTaskProps> = ({ task, column_id, mutate, editPerms }) => {
	return useMemo(
		() => (
			<div className={styles.movableTask}>
				<Box display="flex" alignItems="center">
					{task ? (
						<>
							{editPerms && <Checkbox checked={task.done} onChange={(e) => mutate({ type: 'UPDATE_TASK', column_id: column_id, task_id: task.id, update: { done: e.target.checked } })} />}
							<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'UPDATE_TASK', column_id: column_id, task_id: task.id, update: { content: text } })} text={task.content} size="small" style={{ textDecoration: task.done ? 'line-through' : 'none' }} disabled={!editPerms} />
							{editPerms && (
								<IconButton onClick={() => mutate({ type: 'DELETE_TASK', column_id: column_id, task_id: task.id })} aria-label="Remove task">
									<CloseIcon htmlColor="red" />
								</IconButton>
							)}
						</>
					) : (
						<>
							<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'ADD_TASK', column_id: column_id, content: text })} text="Add New..." size="small" placeholder />
						</>
					)}
				</Box>
			</div>
		),
		[column_id, mutate, editPerms, task]
	);
};

export default MovableTask;
