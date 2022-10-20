import Typography from '@mui/material/Typography';
import { FC, useState } from 'react';

type EditableTypographyProps = {
	text: string;
	onUpdate: (newText: string) => void;
	size: 'small' | 'large';
	disabled?: boolean;
	placeholder?: boolean;
	style?: React.CSSProperties;
};

const EditableTypography: FC<EditableTypographyProps> = ({ onUpdate, text, size, placeholder, style, disabled }) => {
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

	return inputContent === null || disabled === true ? (
		<Typography className="focusable" tabIndex={0} variant="body1" align="left" component={'div'} style={{ fontSize: size === 'large' ? 'larger' : 'initial', letterSpacing: '0.00938em', cursor: 'text', flex: '1', padding: 0, lineHeight: '1.5rem', margin: '0', ...style }} onClick={onClick} onFocus={onFocus}>
			{text}
		</Typography>
	) : (
		<input type="text" placeholder={placeholder ? text : ''} style={{ ...{ letterSpacing: '0.00938em', background: 'transparent', border: 'none', flex: '1', outline: 'none', width: '100%', padding: 0, fontFamily: 'Roboto', lineHeight: '1.5rem', fontSize: size === 'large' ? 'larger' : 'initial' }, ...style }} value={inputContent!} onChange={onChange} onBlur={onBlur} onKeyUp={onKeyUp} autoFocus />
	);
};

export default EditableTypography;
