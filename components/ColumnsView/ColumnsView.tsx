import { FC, useState, useMemo } from 'react';
import { Column } from '../../utils/supabase/projects';
import MovableColumn from '../MovableColumn/MovableColumn';
import styles from './ColumnsView.module.css';
import { Reorder } from 'framer-motion';

type ColumnsViewProps = {
	columns: Column[];
};

const ColumnsView: FC<ColumnsViewProps> = ({ columns }) => {
	const [cols, setCols] = useState<Column[]>(columns);

	function onColsReorder(newCols: Column[]) {
		setCols(newCols);
	}

	return (
		<Reorder.Group axis="x" values={cols} onReorder={onColsReorder} className={styles.columnsView} as="div">
			{cols?.map((column: Column) => (
				<Reorder.Item style={{ padding: 0 }} dragTransition={{ bounceDamping: 20, bounceStiffness: 200 }} key={column.id} value={column} as="div" whileDrag={{ scaleY: 1.06, boxShadow: '0px 8px 12px 4px #14141466' }}>
					<MovableColumn column={column} />
				</Reorder.Item>
			))}
		</Reorder.Group>
	);
};

export default ColumnsView;
