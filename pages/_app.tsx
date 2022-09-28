import '../styles/globals.css';
import type { AppProps } from 'next/app';
import LightTheme from '../themes/light';
import { ThemeProvider } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={LightTheme}>
			<Component {...pageProps} />
		</ThemeProvider>
	);
}

export default MyApp;
