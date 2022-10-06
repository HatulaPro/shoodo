import { FC, useMemo } from 'react';
import { Column } from '../../utils/supabase/projects';
import MovableColumn from '../MovableColumn/MovableColumn';
import styles from './ColumnsView.module.css';

type ColumnsViewProps = {
	columns: Column[];
};

const ColumnsView: FC<ColumnsViewProps> = ({ columns }) => {
	const sortedColumns = useMemo(() => columns?.sort((a, b) => b.importance - a.importance), [columns]);
	return (
		<div className={styles.columnsView}>
			{sortedColumns?.map((column) => (
				<MovableColumn column={column} />
			))}
		</div>
	);
};

export default ColumnsView;
