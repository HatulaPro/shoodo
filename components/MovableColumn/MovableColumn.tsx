import { FC, useState } from 'react';
import { Column } from '../../utils/supabase/projects';
import styles from './MovableColumn.module.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditableTypography from '../EditableTypography/EditableTypography';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
import MovableTask from '../MovableTask/MoveableTask';

type MovableColumnProps = {
	column: Column;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	removeColumn: (column_id: number) => void;
};

const MovableColumn: FC<MovableColumnProps> = ({ column, mutate, removeColumn }) => {
	const [open, setOpen] = useState<boolean>(false);
	function onColumnRename(text: string) {
		if (text !== column.name) {
			mutate({ column_id: column.id, update: { name: text }, type: 'UPDATE' });
		}
	}

	const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
		if (e.relatedTarget?.tagName !== 'input') {
			setOpen(false);
		}
	};

	const onFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
		if (e.target.classList.contains('moveableColumn')) {
			setOpen(true);
		}
	};

	return (
		<div className={cn(styles.movableColumn, 'moveableColumn')} onFocusCapture={onFocus} onBlur={onBlur} tabIndex={-1}>
			<div className={styles.movableColumnTitle} style={{ borderBottom: `4px solid ${column.style}` }}>
				<EditableTypography onUpdate={onColumnRename} text={column.name} size="large" />
			</div>
			<div>
				{column.tasks!.map((task) => (
					<MovableTask key={task.id} task={task} column={column} />
				))}

				<MovableTask column={column} />
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
