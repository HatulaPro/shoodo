import { FC } from 'react';
import { Task } from '../../utils/supabase/projects';
import styles from './MovableTask.module.css';
import Typography from '@mui/material/Typography';

type MovableTaskProps = {
	task: Task;
};

const MovableTask: FC<MovableTaskProps> = ({ task }) => {
	return (
		<div className={styles.movableTask}>
			<Typography variant="body1" component={'p'}>
				{task.content}
			</Typography>
		</div>
	);
};

export default MovableTask;
