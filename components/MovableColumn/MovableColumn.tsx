import { FC } from 'react';
import { Column } from '../../utils/supabase/projects';
import styles from './MovableColumn.module.css';
import Typography from '@mui/material/Typography';
import EditableTypography from '../EditableTypography/EditableTypography';

type MovableColumnProps = {
	column: Column;
};

const MovableColumn: FC<MovableColumnProps> = ({ column }) => {
	const tasks = ['do this', 'do that'];
	return (
		<div className={styles.movableColumn}>
			<div className={styles.movableColumnTitle} style={{ borderBottom: `4px solid ${column.style}` }}>
				<EditableTypography onUpdate={console.log} text={column.name} />
			</div>
			<div>
				{tasks.map((content) => (
					<div className={styles.movableColumnTask}>
						<Typography variant="body1" component={'p'}>
							{content}
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
};

export default MovableColumn;
