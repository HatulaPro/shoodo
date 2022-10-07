import { FC } from 'react';
import { Column, Task } from '../../utils/supabase/projects';
import EditableTypography from '../EditableTypography/EditableTypography';
import styles from './MovableTask.module.css';

type MovableTaskProps = {
	task?: Task;
	column: Column;
};

const MovableTask: FC<MovableTaskProps> = ({ task, column }) => {
	function createTask(text: string) {
		console.log(text, column);
	}

	return (
		<div className={styles.movableTask}>
			{task ? (
				<>
					<EditableTypography onUpdate={console.log} text={task.content} size="small" />
				</>
			) : (
				<>
					<EditableTypography onUpdate={createTask} text="Add New..." size="small" placeholder />
				</>
			)}
		</div>
	);
};

export default MovableTask;
