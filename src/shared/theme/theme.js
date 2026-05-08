import { alpha, createTheme } from '@mui/material/styles';
import { colors } from './colors';

export { colors };

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      lighter: '#E9F0FF',
      100: '#C8D9FF',
      200: '#A3C0FF',
      light: '#7EA6FF',
      400: '#6293FF',
      main: '#4680FF',
      dark: '#3F78FF',
      700: '#376DFF',
      darker: '#2F63FF',
      900: '#2050FF',
      contrastText: colors.white
    },
    secondary: {
      lighter: '#F8F9FA',
      100: '#F8F9FA',
      200: '#F3F5F7',
      light: '#DBE0E5',
      400: '#BEC8D0',
      500: '#8996A4',
      main: '#5B6B79',
      dark: '#3E4853',
      800: '#1D2630',
      darker: '#131920',
      contrastText: colors.white
    },
    success: {
      lighter: '#c0e5d9',
      light: '#6bc2a5',
      main: '#2ca87f',
      dark: '#21976c',
      darker: '#107d4f',
      contrastText: colors.white
    },
    error: {
      lighter: '#f5bebe',
      light: '#e76767',
      main: '#dc2626',
      dark: '#d31c1c',
      darker: '#c50d0d',
      contrastText: colors.white
    },
    info: {
      lighter: '#c5eff3',
      light: '#78d9e2',
      main: '#3ec9d6',
      dark: '#30bccc',
      darker: '#1ba9bc',
      contrastText: colors.white
    },
    warning: {
      lighter: '#f7dcb3',
      light: '#edad4d',
      main: '#e58a00',
      dark: '#de7700',
      darker: '#d35a00',
      contrastText: colors.white
    },
    text: {
      primary: colors.black,
      secondary: colors.gray,
      disabled: alpha(colors.black, 0.38)
    },
    background: {
      default: colors.grayLight,
      paper: colors.white
    },
    divider: alpha('#DBE0E5', 0.65),
    action: {
      active: colors.black,
      hover: alpha(colors.black, 0.04),
      selected: alpha(colors.black, 0.08),
      disabled: alpha(colors.black, 0.3),
      disabledBackground: alpha(colors.black, 0.12)
    }
  },
  typography: {
    htmlFontSize: 16,
    fontFamily: [
      'var(--font-arimo)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontWeight: 600, fontSize: '2.375rem', lineHeight: 1.21 },
    h2: { fontWeight: 600, fontSize: '1.875rem', lineHeight: 1.27 },
    h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.33 },
    h4: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    h6: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.57 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.57 },
    subtitle2: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.66 },
    body1: { fontSize: '0.875rem', lineHeight: 1.57 },
    body2: { fontSize: '0.75rem', lineHeight: 1.66 },
    caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.66 },
    button: { textTransform: 'capitalize' }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.grayLight
        }
      }
    },
    MuiTypography: {
      defaultProps: {
        color: 'text.primary'
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.gray,
          fontSize: '0.75rem',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#4680FF'
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: colors.gray,
          fontSize: '0.75rem'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          textTransform: 'capitalize',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.875rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#DBE0E5'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4680FF'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4680FF',
            borderWidth: 1
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #DBE0E5',
          boxShadow: '0px 2px 6px rgba(17, 24, 39, 0.06)'
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none'
        }
      }
    },
    MuiDialog: {
      defaultProps: {
        fullWidth: true,
        maxWidth: 'md'
      },
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: alpha('#000000', 0.5)
          }
        },
        paper: {
          borderRadius: 12,
          margin: 16,
          width: 'calc(100% - 32px)'
        }
      }
    }
  }
});
