import { FC, useState } from 'react';
import Typography from '@mui/material/Typography';

type EditableTypographyProps = {
	text: string;
	onUpdate: (newText: string) => void;
	size: 'small' | 'large';
	placeholder?: boolean;
};

const EditableTypography: FC<EditableTypographyProps> = ({ onUpdate, text, size, placeholder }) => {
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
		setInputContent(placeholder ? '' : text);
	};

	const onKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			update();
		} else if (e.key === 'Escape') {
			setInputContent(null);
		}
	};

	return inputContent === null ? (
		<Typography variant={size === 'large' ? 'h6' : 'body1'} component={'div'} style={{ cursor: 'text' }} onClick={onClick}>
			{text}
		</Typography>
	) : (
		<input type="text" placeholder={placeholder ? text : ''} style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', fontSize: size === 'large' ? 'larger' : 'initial' }} value={inputContent!} onChange={onChange} onBlur={onBlur} onKeyUp={onKeyUp} autoFocus />
	);
};

export default EditableTypography;
