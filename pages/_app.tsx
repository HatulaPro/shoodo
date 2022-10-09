import { ThemeProvider } from '@mui/material';
import { motion } from 'framer-motion';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from '../components/Header/Header';
import '../styles/globals.css';
import LightTheme from '../themes/light';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={LightTheme}>
				<Head>
					<meta name="description" content="An app to help you manage your to do lists" />
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Header />
				<motion.div
					key={router.route}
					initial="initial"
					animate="animate"
					variants={{
						initial: {
							x: '10vw',
							opacity: 0.5,
						},
						animate: {
							x: 0,
							opacity: 1,
						},
					}}
				>
					<Component {...pageProps} />
				</motion.div>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
