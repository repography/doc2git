import { createTheme } from '@mui/material/styles';

const spacing = 20;

const theme = createTheme({
	spacing,
	typography: {
		htmlFontSize: 12,
		h1: {
			letterSpacing: -1.2,
			marginBottom: spacing,
		},
		body1: {
			marginBottom: spacing,
		},
		body2: {
			marginBottom: spacing,
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: {
					lineHeight: '150%',
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				label: {
					marginBottom: 0,
				},
			},
		},
		MuiStepLabel: {
			styleOverrides: {
				label: {
					marginBottom: 0,
					fontWeight: 'bold',
				},
			},
		},
	},
});

export default theme;
