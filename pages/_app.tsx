import '../styles/globals.css';
import type { AppProps } from 'next/app';
import LightTheme from '../themes/light';
import { ThemeProvider } from '@mui/material';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={LightTheme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default MyApp;
