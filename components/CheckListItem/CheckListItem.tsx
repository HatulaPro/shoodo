import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FC } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import styles from './CheckListItem.module.css';

interface CheckListItemProps {
	text: string;
	index: number;
}

const CheckListItem: FC<CheckListItemProps> = ({ text, index = 0 }) => {
	return (
		<ListItem className={styles.checkListItem} style={{ animationDelay: `${(index + 1) * 0.8}s` }}>
			<ListItemIcon>
				<CheckIcon color="success" />
			</ListItemIcon>
			<ListItemText primary={text} />
		</ListItem>
	);
};

export default CheckListItem;
