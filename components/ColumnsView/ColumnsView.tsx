import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Reorder } from 'framer-motion';
import { FC, useContext } from 'react';
import { UseMutateFunction } from 'react-query';
import { ProjectKeyboardNavigationContext } from '../../contexts/ProjectKeyboardNavigationContext';
import { ColumnMutateArgs } from '../../hooks/useQueryProject';
import { cn } from '../../utils/general';
import { Column } from '../../utils/supabase/projects';
import MovableColumn from '../MovableColumn/MovableColumn';
import styles from './ColumnsView.module.css';

type ColumnsViewProps = {
	columns: Column[];
	setColumns: (cols: Column[]) => void;
	mutate: UseMutateFunction<void, unknown, ColumnMutateArgs, unknown>;
};

const ColumnsView: FC<ColumnsViewProps> = ({ setColumns, columns, mutate }) => {
	const register = useContext(ProjectKeyboardNavigationContext);

	function onColsReorder(newCols: Column[]) {
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
		<>
			<Box display="flex" sx={{ flexDirection: { md: 'column', xs: 'row' } }} mr={2}>
				<IconButton onClick={() => mutate({ type: 'CREATE' })} {...register(-1, -1)}>
					<AddIcon color="primary" fontSize="large" />
				</IconButton>
			</Box>
			<Reorder.Group axis="x" values={columns} onReorder={onColsReorder} className={cn(styles.columnsView, 'scrollbar')} as="div" layoutScroll>
				{columns?.map((column: Column) => (
					<MovableColumn column={column} mutate={mutate} key={column.id} />
				))}
			</Reorder.Group>
		</>
	);
};

export default ColumnsView;
