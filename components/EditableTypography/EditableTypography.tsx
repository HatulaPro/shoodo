import { FC, useState } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

type EditableTypographyProps = {
	text: string;
	onUpdate: (newText: string) => void;
};

const EditableTypography: FC<EditableTypographyProps> = ({ onUpdate, text }) => {
	const [inputContent, setInputContent] = useState<null | string>(null);

	function update() {
		onUpdate(inputContent!);
		setInputContent(null);
	}

	const onBlur: React.FocusEventHandler<HTMLInputElement> = () => {
		update();
	};

	const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setInputContent(e.target.value);
	};

	const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
		setInputContent(text);
	};

	const onKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			update();
		} else if (e.key === 'Escape') {
			setInputContent(null);
		}
	};

	return inputContent === null ? (
		<Typography variant="h6" component={'div'} style={{ cursor: 'text' }} onClick={onClick}>
			{text}
		</Typography>
	) : (
		<input type="text" value={inputContent!} onChange={onChange} onBlur={onBlur} onKeyUp={onKeyUp} autoFocus className="MuiTypography-root MuiTypography-h6 css-6nwon9-MuiTypography-root" />
	);
};

export default EditableTypography;
