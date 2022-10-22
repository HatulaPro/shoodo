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
		scrollerRef.current.style.opacity = columnsRef.current.clientWidth < columnsRef.current.scrollWidth ? '1' : '0';
		scrollerRef.current.style.width = columnsRef.current.clientWidth + 'px';
		const scrollerChild = scrollerRef.current.children[0] as HTMLDivElement;
		scrollerChild.style.width = columnsRef.current.scrollWidth + 'px';

		const listenToScroller = () => {
			columnsRef.current!.scrollTo({ left: scrollerRef.current!.scrollLeft, behavior: 'smooth' });
		};

		const listenToNative = () => {
			scrollerRef.current!.scrollTo({ left: columnsRef.current!.scrollLeft, behavior: 'smooth' });
		};

		columnsRef.current.addEventListener('scroll', listenToNative);
		scrollerRef.current.addEventListener('scroll', listenToScroller);

		return () => {
			columnsRef.current?.removeEventListener('scroll', listenToNative);
			scrollerRef.current?.removeEventListener('scroll', listenToScroller);
		};
	}, [scrollerRef, columnsRef, columns, window.innerWidth]);

	return (
		<div>
			<div className="scrollbar" ref={scrollerRef} style={{ overflowX: 'scroll', transition: 'all 0.2s' }}>
				<div style={{ paddingTop: '1px', transition: 'all 0.2s' }}></div>
			</div>
			<Reorder.Group ref={columnsRef} axis="x" values={columns} onReorder={onColsReorder} className={styles.columnsView} style={{ overflow: 'hidden' }} as="div" layoutScroll>
				{columns?.map((column, index) => (
					<MovableColumn column={column} columns={columns} index={index} mutate={mutate} key={column.id} editPerms={editPerms} />
				))}
			</Reorder.Group>
		</div>
	);
};

export default ColumnsView;
