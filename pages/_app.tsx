import '../styles/globals.css';
import type { AppProps } from 'next/app';
import LightTheme from '../themes/light';
import { ThemeProvider } from '@mui/material';
import { QueryClientProvider, QueryClient } from 'react-query';
import { motion } from 'framer-motion';
import Header from '../components/Header/Header';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps, router }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={LightTheme}>
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
