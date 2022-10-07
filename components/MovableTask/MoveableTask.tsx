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
			mutate?: undefined;
	  }
	| {
			task?: undefined;
			column: Column;
			mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	  };

const MovableTask: FC<MovableTaskProps> = ({ task, column, mutate }) => {
	return (
		<div className={styles.movableTask}>
			{task ? (
				<>
					<EditableTypography onUpdate={console.log} text={task.content} size="small" />
				</>
			) : (
				<>
					<EditableTypography onUpdate={(text) => text.length > 0 && mutate({ type: 'ADD_TASK', column_id: column.id, content: text })} text="Add New..." size="small" placeholder />
				</>
			)}
		</div>
	);
};

export default MovableTask;
