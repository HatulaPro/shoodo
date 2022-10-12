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
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import styles from '../../styles/Auth.module.css';
import { signInWithEmail } from '../../utils/supabase/auth';

interface LoginForm {
	email: string;
}

const AuthPage: NextPage = () => {
	const [showInfo, setShowInfo] = useState<boolean>(false);
	const { control, handleSubmit } = useForm<LoginForm>();

	function changeShowInfo() {
		setShowInfo((prev) => !prev);
	}

	const { isLoading, isSuccess, mutateAsync } = useMutation(async (data: LoginForm) => {
		signInWithEmail(data.email);
	});

	function onSubmit(data: LoginForm) {
		mutateAsync(data);
	}

	return (
		<div>
			<Head>
				<title>Shoodo | Log In</title>
			</Head>
			<Container className={styles.authPage}>
				<Box className={styles.authFormWrapper} sx={{ backgroundColor: 'background.default', px: { md: 6, xs: 3 }, py: { md: 4, xs: 2 } }}>
					<Typography variant="h3" component="h1" color="primary.dark">
						Log In
					</Typography>
					<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 6 }}>
						<Controller
							name="email"
							control={control}
							rules={{
								required: { message: 'this field is required', value: true },
								pattern: {
									message: 'Must be a valid email',
									value: /\S+@\S+\.\S+/,
								},
							}}
							render={({ field, fieldState }) => {
								return <TextField {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} disabled={isLoading} fullWidth variant="outlined" color="primary" type="text" placeholder="example@example.com" label="email" />;
							}}
						/>
						<br />
						<br />
						{isSuccess ? (
							'A magic link has been sent to your email.'
						) : isLoading ? (
							<LinearProgress color="secondary" />
						) : (
							<Button type="submit" variant="contained">
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
