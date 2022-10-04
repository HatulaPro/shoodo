import { FC } from 'react';
import { Column } from '../../utils/supabase/projects';
import MovableColumn from '../MovableColumn/MovableColumn';
import styles from './ColumnsView.module.css';

type ColumnsViewProps = {
	columns: Column[];
};

const ColumnsView: FC<ColumnsViewProps> = ({ columns }) => {
	return (
		<div className={styles.columnsView}>
			{columns?.map((column) => (
				<MovableColumn column={column} />
			))}
		</div>
	);
};

export default ColumnsView;
