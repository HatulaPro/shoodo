import { NextPage } from 'next';
import Head from 'next/head';
import { signInWithEmail } from '../../utils/supabase/auth';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import styles from './Auth.module.css';
import { ChangeEventHandler } from 'react';

const AuthPage: NextPage = () => {
	const [email, setEmail] = useState<string>('');
	const [isLoading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [sent, setSent] = useState<boolean>(false);

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
				<title>Shoodo</title>
				<meta name="description" content="An app to help you manage your to do lists" />
				<link rel="icon" href="/favicon.ico" />
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
							'Sending...'
						) : (
							<Button disabled={!Boolean(email)} type="submit" variant="contained">
								Submit
							</Button>
						)}
					</Box>
				</Box>
			</Container>
		</div>
	);
};

export default AuthPage;
