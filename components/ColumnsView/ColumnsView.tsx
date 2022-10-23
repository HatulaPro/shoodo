import { Reorder } from 'framer-motion';
import { FC, useEffect, useRef } from 'react';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import type { ColumnWithTasks } from '../../utils/supabase/projects';
import MovableColumn from '../MovableColumn/MovableColumn';
import styles from './ColumnsView.module.css';

type ColumnsViewProps = {
	columns: ColumnWithTasks[];
	setColumns: (cols: ColumnWithTasks[]) => void;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
	editPerms: boolean;
};

const ColumnsView: FC<ColumnsViewProps> = ({ setColumns, columns, mutate, editPerms }) => {
	const scrollerRef = useRef<HTMLDivElement | null>(null);
	const columnsRef = useRef<HTMLDivElement | null>(null);
	function onColsReorder(newCols: ColumnWithTasks[]) {
		if (newCols.length === 0) return setColumns(newCols);

		let prevImportance = newCols[0].importance;
		for (let i = 1; i < newCols.length; i++) {
			if (newCols[i].importance < prevImportance) {
				// this is where swap
				if (i < newCols.length - 1) {
					newCols[i].importance = (prevImportance + newCols[i + 1].importance) / 2;
				} else {
					newCols[i].importance = prevImportance + Math.pow(2, 32);
				}
				mutate({ column_id: newCols[i].id, update: { importance: newCols[i].importance }, type: 'UPDATE' });
			}
			prevImportance = newCols[i].importance;
		}
		setColumns(newCols);
	}

	useEffect(() => {
		if (!scrollerRef.current || !columnsRef.current) return;
		console.log(scrollerRef.current.clientWidth, columnsRef.current.scrollWidth);
		if (scrollerRef.current.clientWidth < columnsRef.current.scrollWidth) {
			scrollerRef.current.style.overflowX = 'scroll';
		} else {
			scrollerRef.current.style.overflowX = 'hidden';
		}
	}, [scrollerRef, columnsRef, columns]);

	return (
		<div ref={scrollerRef} className="scrollbar" style={{ transform: 'rotate(180deg)', overflowX: 'scroll', display: 'flex', flexDirection: 'row-reverse' }}>
			<Reorder.Group ref={columnsRef} axis="x" values={columns} onReorder={onColsReorder} className={styles.columnsView} as="div">
				{columns?.map((column, index) => (
					<MovableColumn setColumns={setColumns} column={column} columns={columns} index={index} mutate={mutate} key={column.id} editPerms={editPerms} />
				))}
			</Reorder.Group>
		</div>
	);
};

export default ColumnsView;
