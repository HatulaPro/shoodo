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
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { MessageHandlerContext } from '../../../pages/projects/[id]';
import LogoSvg from '../../LogoSvg/LogoSvg';

type ChatDialogProps = {
	open: boolean;
	handleClose: () => void;
	project_name: string;
};

const ChatDialog: FC<ChatDialogProps> = ({ open, handleClose, project_name }) => {
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [value, setValue] = useState<string>('');
	const messageHandler = useContext(MessageHandlerContext);
	const messagesContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesContainerRef.current === null) return;
		const children = messagesContainerRef.current.children;
		if (children.length === 0) return;

		const fromBottom = messagesContainerRef.current.scrollHeight - messagesContainerRef.current.clientHeight - messagesContainerRef.current.scrollTop;
		const msgHeight = children[children.length - 1].clientHeight;
		if (Math.abs(fromBottom - msgHeight) < 10) {
			children[children.length - 1].scrollIntoView({ behavior: 'smooth' });
		}
	}, [messageHandler?.messages, messagesContainerRef]);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (value.length > 0) {
			messageHandler?.sendMessage(value);
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
			<DialogContent ref={messagesContainerRef} className="scrollbar" sx={{ xs: { maxHeight: '100vh' }, md: { maxHeight: '40vh' } }} style={{ overflowY: 'scroll', marginTop: 'auto' }}>
				{messageHandler?.messages.map((msg, index) => (
					<div key={index} style={{ wordWrap: 'break-word' }}>
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
