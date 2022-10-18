import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import PaletteIcon from '@mui/icons-material/Palette';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { PanInfo } from 'framer-motion';
import { Reorder, useDragControls } from 'framer-motion';
import { FC, useContext, useRef, useState } from 'react';
import type { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import type { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
import type { Column, Task } from '../../utils/supabase/projects';
import ColorPickerDialog from '../Dialogs/ColorPickerDialog/ColorPickerDialog';
import EditableTypography from '../EditableTypography/EditableTypography';
import MovableTask from '../MovableTask/MoveableTask';
import styles from './MovableColumn.module.css';

type MovableColumnProps = {
	column: Column;
	columns: Column[];
	index: number;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	editPerms: boolean;
};

const MovableColumn: FC<MovableColumnProps> = ({ column, mutate, columns, index, editPerms }) => {
	const parentRef = useRef(null);
	const [openTools, setOpenTools] = useState<boolean>(false);
	const [openColorPicker, setOpenColorPicker] = useState<boolean>(false);
	const tasks = column.tasks!;
	const controls = useDragControls();
	const register = useContext(ProjectKeyboardNavigationContext);
	const columnRef = useRef<HTMLElement | null>(null);

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
		if (newTasks.length === 0) return (column.tasks = newTasks);

		if (new Set(newTasks.map((t) => t.importance)).size < newTasks.length) {
			mutate({ type: 'UPDATE_TASK_INDEXES', column });
			return;
		}

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

	function onDragEnd(task_id: number) {
		return (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			console.log(event);
			const colWidth = columnRef.current!.clientWidth; // 300
			const scrollerWidth = columnRef.current!.parentElement!.scrollWidth; // 964
			const colCount = columnRef.current!.parentElement!.children.length; // 3
			const colGap = (scrollerWidth - colCount * colWidth) / (colWidth - 1); // 32
			const offsetX = info.offset.x;
			const nextIndex = index + Math.round(offsetX / (colWidth + colGap));
			if (nextIndex === index) return;

			mutate({ type: 'MOVE_TASK', currentIndex: index, nextIndex, task_id });
		};
	}

	function moveLeft() {
		if (index === 0) return;

		const prev = columns[index - 1];
		if (index === 1) {
			columns[0] = column;
			columns[1] = prev;
			return mutate({ column_id: column.id, update: { importance: prev.importance - Math.pow(2, 33) }, type: 'UPDATE' });
		}

		const twoPrev = columns[index - 2];
		columns[index - 1] = column;
		columns[index] = prev;
		return mutate({ column_id: column.id, update: { importance: (prev.importance + twoPrev.importance) / 2 }, type: 'UPDATE' });
	}

	function moveRight() {
		if (index === columns.length - 1) return;

		const next = columns[index + 1];
		if (index === columns.length - 2) {
			columns[index + 1] = column;
			columns[index] = next;
			return mutate({ column_id: column.id, update: { importance: next.importance + Math.pow(2, 33) }, type: 'UPDATE' });
		}

		const twoNext = columns[index + 2];
		columns[index + 1] = column;
		columns[index] = next;
		return mutate({ column_id: column.id, update: { importance: (next.importance + twoNext.importance) / 2 }, type: 'UPDATE' });
	}

	return (
		<Reorder.Item ref={columnRef} dragControls={controls} dragListener={false} style={{ padding: 0 }} dragTransition={{ bounceDamping: 20, bounceStiffness: 200 }} value={column} as="div" whileDrag={{ filter: 'brightness(0.97)', boxShadow: '0px 0px 12px 14px #14141466' }}>
			<div className={cn(styles.movableColumn, 'moveableColumn')} onFocusCapture={onFocus} onBlur={onBlur} tabIndex={-1}>
				{editPerms && (
					<>
						<IconButton className="mouseOnly" onPointerDown={(e) => controls.start(e)}>
							<DragHandleIcon />
						</IconButton>

						<Box display="flex" className="touchOnly" justifyContent="space-around">
							<IconButton onClick={moveLeft}>
								<ArrowBackIcon fontSize="large" />
							</IconButton>
							<IconButton onClick={moveRight}>
								<ArrowForwardIcon fontSize="large" />
							</IconButton>
						</Box>
					</>
				)}

				<div className={cn(styles.movableColumnTitle)} style={{ borderBottom: `4px solid ${column.style}` }} {...register(column.id, -1)}>
					<EditableTypography onUpdate={onColumnRename} text={column.name} size="large" disabled={!editPerms} />
				</div>
				<div>
					<div ref={parentRef}>
						<Reorder.Group axis="y" as="div" values={tasks} onReorder={onTasksReorder}>
							{tasks.map((task) => (
								<Reorder.Item drag={editPerms} onDragEnd={onDragEnd(task.id)} key={task.id} value={task} as="div" dragTransition={{ bounceDamping: 20, bounceStiffness: 200 }}>
									<MovableTask task={task} column={column} mutate={mutate} editPerms={editPerms} />
								</Reorder.Item>
							))}
						</Reorder.Group>
					</div>

					{editPerms && <MovableTask column={column} mutate={mutate} editPerms={true} />}
				</div>
				{editPerms && (
					<div className={cn(styles.movableColumnTools, openTools && styles.movableColumnToolsOpen)}>
						<IconButton sx={{ mb: 0 }} onClick={() => mutate({ type: 'DELETE', column_id: column.id })}>
							<DeleteIcon htmlColor="red" />
						</IconButton>
						<IconButton onClick={() => setOpenColorPicker(true)}>
							<PaletteIcon htmlColor={column.style} />
						</IconButton>
					</div>
				)}
				{openColorPicker && <ColorPickerDialog open={openColorPicker} handleClose={() => setOpenColorPicker(false)} defaultColor={column.style} onUpdate={updateColumnColor} />}
			</div>
		</Reorder.Item>
	);
};

export default MovableColumn;
