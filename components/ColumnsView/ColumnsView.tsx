import { FC, useState, useMemo } from 'react';
import { Column, deleteColumn } from '../../utils/supabase/projects';
import MovableColumn from '../MovableColumn/MovableColumn';
import styles from './ColumnsView.module.css';
import { Reorder } from 'framer-motion';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';

type ColumnsViewProps = {
	columns: Column[];
	setColumns: (cols: Column[]) => void;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
};

function sortColumns(columns: Column[]): Column[] {
	return columns.slice().sort((a, b) => a.importance - b.importance);
}

const ColumnsView: FC<ColumnsViewProps> = ({ setColumns, columns, mutate }) => {
	const sortedCols = useMemo(() => sortColumns(columns), [columns]);

	function onColsReorder(newCols: Column[]) {
		console.log(newCols);
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

	function removeColumn(column_id: number) {
		setColumns(columns.filter((col) => col.id !== column_id));
		deleteColumn(column_id);
	}

	return (
		<Reorder.Group axis="x" values={sortedCols} onReorder={onColsReorder} className={cn(styles.columnsView, 'scrollbar')} as="div" layoutScroll style={{ overflowX: 'scroll' }}>
			{sortedCols?.map((column: Column) => (
				<Reorder.Item style={{ padding: 0 }} dragTransition={{ bounceDamping: 20, bounceStiffness: 200 }} key={column.id} value={column} as="div" whileDrag={{ scaleY: 1.06, boxShadow: '0px 8px 12px 4px #14141466' }}>
					<MovableColumn removeColumn={removeColumn} column={column} mutate={mutate} />
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
};

export default ColumnsView;
