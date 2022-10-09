import InfoIcon from '@mui/icons-material/InfoOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { signInWithEmail } from '../../utils/supabase/auth';
import styles from './Auth.module.css';

const AuthPage: NextPage = () => {
	const [email, setEmail] = useState<string>('');
	const [isLoading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState<boolean>(false);
	const [showInfo, setShowInfo] = useState<boolean>(false);

	function changeShowInfo() {
		setShowInfo((prev) => !prev);
	}

	function sendLogInEmail(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		signInWithEmail(email).then(({ error: err }) => {
			if (err?.message) {
				setError(err.message);
			} else {
				setSent(true);
				setError(null);
			}
			setLoading(false);
		});
	}

	function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.target.value);
		setError(null);
		setSent(false);
	}

	return (
		<div>
			<Head>
				<title>Shoodo | Log In</title>
			</Head>
			<Container className={styles.authPage}>
				<Box className={styles.authFormWrapper} sx={{ backgroundColor: 'background.default', px: 6, py: 4 }}>
					<Typography variant="h3" component="h1" color="primary.dark">
						Log In
					</Typography>
					<Box component="form" onSubmit={sendLogInEmail} sx={{ mt: 6 }}>
						<TextField error={Boolean(error)} helperText={error} disabled={isLoading} fullWidth variant="outlined" color="primary" type="email" value={email} placeholder="example@example.com" label="email" onChange={onEmailChange} />
						<br />
						<br />
						{sent ? (
							'A magic link has been sent to your email.'
						) : isLoading ? (
							<LinearProgress color="secondary" />
						) : (
							<Button disabled={!Boolean(email)} type="submit" variant="contained">
								Submit
							</Button>
						)}
						<Divider sx={{ my: 2 }} />
						<Button onClick={changeShowInfo} variant="outlined" sx={{ color: 'success.dark' }} startIcon={<InfoIcon />}>
							Don&apos;t have an account?
						</Button>
						<Box style={{ transition: '0.3s all', overflow: 'hidden', maxHeight: showInfo ? '6rem' : '0rem' }} sx={{ mt: 2 }}>
							<Typography variant="body1" color="info.contrast">
								<b>Doesn&apos;t matter!</b>
								<br />
								You can still log in using your email. No password is needed!
							</Typography>
						</Box>
					</Box>
				</Box>
			</Container>
		</div>
	);
};

export default AuthPage;
