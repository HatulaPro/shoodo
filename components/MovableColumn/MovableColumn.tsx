import { FC } from 'react';
import { Column } from '../../utils/supabase/projects';
import styles from './MovableColumn.module.css';
import Typography from '@mui/material/Typography';
import EditableTypography from '../EditableTypography/EditableTypography';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../pages/projects/[id]';

type MovableColumnProps = {
	column: Column;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
};

const MovableColumn: FC<MovableColumnProps> = ({ column, mutate }) => {
	const tasks = ['do this', 'do that'];

	function onColumnRename(text: string) {
		if (text !== column.name) {
			mutate({ column_id: column.id, update: { name: text } });
		}
	}

	return (
		<div className={styles.movableColumn}>
			<div className={styles.movableColumnTitle} style={{ borderBottom: `4px solid ${column.style}` }}>
				<EditableTypography onUpdate={onColumnRename} text={column.name} />
			</div>
			<div>
				{tasks.map((content) => (
					<div className={styles.movableColumnTask} key={content}>
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
