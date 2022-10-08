import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PaletteIcon from '@mui/icons-material/Palette';
import IconButton from '@mui/material/IconButton';
import { Reorder, useDragControls } from 'framer-motion';
import { FC, useRef, useState } from 'react';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
import { Column, Task } from '../../utils/supabase/projects';
import ColorPickerDialog from '../ColorPickerDialog/ColorPickerDialog';
import EditableTypography from '../EditableTypography/EditableTypography';
import MovableTask from '../MovableTask/MoveableTask';
import styles from './MovableColumn.module.css';

type MovableColumnProps = {
	column: Column;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
};

const MovableColumn: FC<MovableColumnProps> = ({ column, mutate }) => {
	const parentRef = useRef(null);
	const [openTools, setOpenTools] = useState<boolean>(false);
	const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
	const tasks = column.tasks!;
	const controls = useDragControls();

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

	function onTasksReorder(newTasks: Task[]) {
		console.log(newTasks);
		if (newTasks.length === 0) return (column.tasks = newTasks);

		let prevImportance = newTasks[0].importance;
		for (let i = 1; i < newTasks.length; i++) {
			if (newTasks[i].importance < prevImportance) {
				// this is where swap
				if (i < newTasks.length - 1) {
					newTasks[i].importance = (prevImportance + newTasks[i + 1].importance) / 2;
				} else {
					newTasks[i].importance = prevImportance + Math.pow(2, 32);
				}
				mutate({ task_id: newTasks[i].id, column_id: column.id, update: { importance: newTasks[i].importance }, type: 'UPDATE_TASK' });
			}
			prevImportance = newTasks[i].importance;
		}
		if (newTasks.length === 0) return (column.tasks = newTasks);
	}

	return (
		<Reorder.Item dragControls={controls} dragListener={false} style={{ padding: 0 }} dragTransition={{ bounceDamping: 20, bounceStiffness: 200 }} value={column} as="div" whileDrag={{ filter: 'brightness(0.97)', boxShadow: '0px 0px 12px 14px #14141466' }}>
			<div className={cn(styles.movableColumn, 'moveableColumn')} onFocusCapture={onFocus} onBlur={onBlur} tabIndex={-1}>
				<IconButton onPointerDown={(e) => controls.start(e)}>
					<DragHandleIcon />
				</IconButton>

				<div className={styles.movableColumnTitle} style={{ borderBottom: `4px solid ${column.style}` }}>
					<EditableTypography onUpdate={onColumnRename} text={column.name} size="large" />
				</div>
				<div>
					<div ref={parentRef}>
						<Reorder.Group axis="y" as="div" values={tasks} onReorder={onTasksReorder}>
							{tasks.map((task) => (
								<Reorder.Item dragConstraints={parentRef} key={task.id} value={task} as="div" dragTransition={{ bounceDamping: 20, bounceStiffness: 200 }}>
									<MovableTask task={task} column={column} mutate={mutate} />
								</Reorder.Item>
							))}
						</Reorder.Group>
					</div>

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
		</Reorder.Item>
	);
};

export default MovableColumn;
