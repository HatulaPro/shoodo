import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FC, useLayoutEffect, useRef, useState } from 'react';
import type { Message } from '../../../hooks/useRealtimeProject';
import LogoSvg from '../../LogoSvg/LogoSvg';

type ChatDialogProps = {
	open: boolean;
	handleClose: () => void;
	messages: Message[];
	sendMessage: (message: string) => void;
	project_name: string;
};

const ChatDialog: FC<ChatDialogProps> = ({ messages, open, handleClose, sendMessage, project_name }) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [value, setValue] = useState<string>('');
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (messagesContainerRef.current === null) return;
		const children = messagesContainerRef.current.children;
		if (children.length === 0) return;

		children[children.length - 1].scrollIntoView({ behavior: 'smooth' });
	}, [messages, messagesContainerRef]);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (value.length > 0) {
			sendMessage(value);
			setValue('');
		}
	};

	return (
		<Dialog open={open} onClose={() => handleClose()} maxWidth="md" fullWidth fullScreen={isSmallScreen} disableEscapeKeyDown>
			<DialogTitle style={{ display: 'flex', justifyContent: 'space-between' }}>
				<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
					<LogoSvg />
					Chat | {project_name}
				</div>
				<IconButton onClick={() => handleClose()} color="error">
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent ref={messagesContainerRef} className="scrollbar" style={{ maxHeight: '40vh', overflowY: 'scroll' }}>
				{messages.map((msg, index) => (
					<div key={index}>
						<b>{msg.user}</b> {msg.content}
					</div>
				))}
			</DialogContent>
			<DialogActions>
				<form onSubmit={onSubmit} style={{ width: '100%' }}>
					<TextField
						value={value}
						onChange={(e) => setValue(e.target.value)}
						autoFocus
						margin="dense"
						label="Message"
						type="text"
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton type="submit" aria-label="submit">
										<SendIcon color="primary" />
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
				</form>
			</DialogActions>
		</Dialog>
	);
};

export default ChatDialog;
