import { FC } from 'react';
import { Column, Task } from '../../utils/supabase/projects';
import styles from './MovableTask.module.css';
import Typography from '@mui/material/Typography';
import EditableTypography from '../EditableTypography/EditableTypography';

type MovableTaskProps = {
	task?: Task;
	column: Column;
};

const MovableTask: FC<MovableTaskProps> = ({ task, column }) => {
	return <div className={styles.movableTask}>{task ? <EditableTypography onUpdate={console.log} text={task.content} size="small" /> : <EditableTypography onUpdate={console.log} text={column.name} size="small" />}</div>;
};

export default MovableTask;
