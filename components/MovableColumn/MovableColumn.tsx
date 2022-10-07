import { FC, useState } from 'react';
import { Column } from '../../utils/supabase/projects';
import styles from './MovableColumn.module.css';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditableTypography from '../EditableTypography/EditableTypography';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';

type MovableColumnProps = {
	column: Column;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	removeColumn: (column_id: number) => void;
};

const MovableColumn: FC<MovableColumnProps> = ({ column, mutate, removeColumn }) => {
	const [open, setOpen] = useState<boolean>(false);
	const tasks = ['do this', 'do that'];

	function onColumnRename(text: string) {
		if (text !== column.name) {
			mutate({ column_id: column.id, update: { name: text }, type: 'UPDATE' });
		}
	}
	return (
		<div className={styles.movableColumn} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} tabIndex={-1}>
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
			<div className={cn(styles.movableColumnTools, open && styles.movableColumnToolsOpen)}>
				<IconButton sx={{ mb: 0 }} onClick={() => removeColumn(column.id)}>
					<DeleteIcon htmlColor="red" />
				</IconButton>
			</div>
		</div>
	);
};

export default MovableColumn;
