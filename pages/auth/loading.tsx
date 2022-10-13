import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';

const LoadingAuthPage: NextPage = () => {
	const router = useRouter();
	const user = useUser();

	useEffect(() => {
		if (!user.isLoading) {
			if (user.user) {
				router.push('/projects');
			} else {
				router.push('/auth');
			}
		}
	}, [user, router]);

	return (
		<div>
			<Head>
				<title>Shoodo | Signing In...</title>
			</Head>
			<Box display="flex" flexDirection="column" gap={3} justifyContent="center" alignItems="center" style={{ height: '70vh' }}>
				<Typography variant="h3" component="h1" textAlign="center">
					Signing You In...
				</Typography>
				<CircularProgress color="secondary" />
			</Box>
		</div>
	);
};

export default LoadingAuthPage;
