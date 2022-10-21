import { Reorder } from 'framer-motion';
import { FC } from 'react';
import { UseMutateFunction } from 'react-query';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
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

	return (
		<Reorder.Group axis="x" values={columns} onReorder={onColsReorder} className={cn(styles.columnsView, 'scrollbar')} as="div" layoutScroll>
			{columns?.map((column, index) => (
				<MovableColumn column={column} columns={columns} index={index} mutate={mutate} key={column.id} editPerms={editPerms} />
			))}
		</Reorder.Group>
	);
};

export default ColumnsView;
