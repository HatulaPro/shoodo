import { createTheme } from '@mui/material';
import { responsiveFontSizes } from '@mui/material/styles';

export default responsiveFontSizes(
	createTheme({
		palette: {
			mode: 'light',
			primary: {
				main: '#2979ff',
			},
			secondary: {
				main: '#ec407a',
			},
			info: {
				main: '#4fc3f7',
			},
		},
		components: {
			MuiButton: {
				styleOverrides: {
					root: {
						padding: '6px 16px',
						borderRadius: '8px',
					},
				},
			},
		},
	})
);
