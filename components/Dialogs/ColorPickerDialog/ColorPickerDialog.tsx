import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FC, useState } from 'react';
import { cn } from '../../../utils/general';
import styles from './ColorPickerDialog.module.css';

type ColorPickerDialogProps = {
	defaultColor: string;
	open: boolean;
	onUpdate: (color: string) => void;
	handleClose: () => void;
};

const availableColors = [
	{ color: 'blue', contrast: 'white' },
	{ color: 'orange', contrast: 'black' },
	{ color: 'red', contrast: 'white' },
	{ color: 'yellow', contrast: 'black' },
	{ color: 'green', contrast: 'white' },
	{ color: 'teal', contrast: 'white' },
	{ color: 'purple', contrast: 'white' },
	{ color: 'black', contrast: 'white' },
	{ color: 'white', contrast: 'black' },
];

const ColorPickerDialog: FC<ColorPickerDialogProps> = ({ defaultColor, open, onUpdate, handleClose }) => {
	const defaultColorIndex = availableColors.findIndex((style) => style.color === defaultColor);
	const [chosenColor, setChosenColor] = useState<number>(defaultColorIndex === -1 ? 0 : defaultColorIndex);

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Pick A Color</DialogTitle>
			<DialogContent style={{ overflow: 'visible' }}>
				<Box display="flex" gap={1} justifyContent="center" alignItems="center" overflow="visible" style={{ flexWrap: 'wrap' }}>
					{availableColors.map((style, index) => (
						<div key={style.color} style={{ background: style.color }} onClick={() => setChosenColor(index)} className={cn(styles.colorPickerDialogSquare, chosenColor === index && styles.colorPickerDialogSquareChosen)}></div>
					))}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onUpdate(availableColors[chosenColor].color)} variant="contained" style={{ background: availableColors[chosenColor].color, color: availableColors[chosenColor].contrast }}>
					SAVE
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ColorPickerDialog;
