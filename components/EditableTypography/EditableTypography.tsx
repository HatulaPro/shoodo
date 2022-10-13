import Typography from '@mui/material/Typography';
import { FC, useState } from 'react';

type EditableTypographyProps = {
	text: string;
	onUpdate: (newText: string) => void;
	size: 'small' | 'large';
	placeholder?: boolean;
	style?: React.CSSProperties;
};

const EditableTypography: FC<EditableTypographyProps> = ({ onUpdate, text, size, placeholder, style }) => {
	const [inputContent, setInputContent] = useState<null | string>(null);

	function update() {
		if (inputContent !== text) {
			onUpdate(inputContent!);
		}
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

	const onFocus: React.FocusEventHandler<HTMLDivElement> = () => {
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
		<Typography className="focusable" tabIndex={0} variant={size === 'large' ? 'h6' : 'body1'} align="left" component={'div'} style={{ cursor: 'text', flex: '1', ...style }} onClick={onClick} onFocus={onFocus}>
			{text}
		</Typography>
	) : (
		<input type="text" placeholder={placeholder ? text : ''} style={{ ...{ letterSpacing: '0.0075rem', background: 'transparent', border: 'none', flex: '1', outline: 'none', width: '100%', padding: size === 'large' ? '3px' : 0, fontFamily: 'Roboto', fontSize: size === 'large' ? 'larger' : 'initial' }, ...style }} value={inputContent!} onChange={onChange} onBlur={onBlur} onKeyUp={onKeyUp} autoFocus />
	);
};

export default EditableTypography;
