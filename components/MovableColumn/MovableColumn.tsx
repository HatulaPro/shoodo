import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import IconButton from '@mui/material/IconButton';
import { FC, useState } from 'react';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
import { Column, Task } from '../../utils/supabase/projects';
import ColorPickerDialog from '../ColorPickerDialog/ColorPickerDialog';
import EditableTypography from '../EditableTypography/EditableTypography';
import MovableTask from '../MovableTask/MoveableTask';
import styles from './MovableColumn.module.css';

function sortTasks(tasks: Task[]): Task[] {
	return tasks.slice().sort((a, b) => a.importance - b.importance);
}

type MovableColumnProps = {
	column: Column;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
};

const MovableColumn: FC<MovableColumnProps> = ({ column, mutate }) => {
	const [openTools, setOpenTools] = useState<boolean>(false);
	const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
	const sortedTasks = sortTasks(column.tasks!);

	function onColumnRename(text: string) {
		if (text !== column.name) {
			mutate({ column_id: column.id, update: { name: text }, type: 'UPDATE' });
		}
	}

	const onBlur: React.FocusEventHandler<HTMLDivElement> = (e) => {
		if (e.relatedTarget?.tagName !== 'input') {
			setOpenTools(false);
		}
	};

	const onFocus: React.FocusEventHandler<HTMLDivElement> = (e) => {
		if (e.target.classList.contains('moveableColumn')) {
			setOpenTools(true);
		}
	};

	function updateColumnColor(newColor: string) {
		setOpenColorPicker(false);
		mutate({ column_id: column.id, update: { style: newColor }, type: 'UPDATE' });
	}

	return (
		<div className={cn(styles.movableColumn, 'moveableColumn')} onFocusCapture={onFocus} onBlur={onBlur} tabIndex={-1}>
			<div className={styles.movableColumnTitle} style={{ borderBottom: `4px solid ${column.style}` }}>
				<EditableTypography onUpdate={onColumnRename} text={column.name} size="large" />
			</div>
			<div>
				{sortedTasks.map((task) => (
					<MovableTask key={task.id} task={task} column={column} mutate={mutate} />
				))}

				<MovableTask column={column} mutate={mutate} />
			</div>
			<div className={cn(styles.movableColumnTools, openTools && styles.movableColumnToolsOpen)}>
				<IconButton sx={{ mb: 0 }} onClick={() => mutate({ type: 'DELETE', column_id: column.id })}>
					<DeleteIcon htmlColor="red" />
				</IconButton>
				<IconButton onClick={() => setOpenColorPicker(true)}>
					<PaletteIcon htmlColor={column.style} />
				</IconButton>
			</div>
			{openColorPicker && <ColorPickerDialog open={openColorPicker} handleClose={() => setOpenColorPicker(false)} defaultColor={column.style} onUpdate={updateColumnColor} />}
		</div>
	);
};

export default MovableColumn;
