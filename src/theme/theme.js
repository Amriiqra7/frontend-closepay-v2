import { createTheme } from '@mui/material/styles';
import { colors } from './colors';

// Re-export colors untuk kemudahan import
export { colors };

// Theme configuration
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.black,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.white,
      contrastText: colors.black,
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: colors.white,
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: colors.white,
    },
    info: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: colors.white,
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: colors.white,
    },
    background: {
      default: colors.white,
      paper: colors.white,
    },
    text: {
      primary: colors.black,
      secondary: colors.gray,
    },
    divider: colors.grayBorder,
    action: {
      active: colors.black,
      hover: 'rgba(38, 38, 38, 0.08)',
      selected: 'rgba(38, 38, 38, 0.12)',
      disabled: 'rgba(38, 38, 38, 0.26)',
      disabledBackground: 'rgba(38, 38, 38, 0.12)',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-archivo)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    // Typography - Default color otomatis dari theme (#262626)
    // Tidak perlu specify color, akan otomatis menggunakan text.primary
    MuiTypography: {
      defaultProps: {
        color: 'text.primary',
      },
    },
    // InputLabel - Default color otomatis
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.black,
          '&.Mui-focused': {
            color: colors.black,
          },
        },
      },
    },
    // FormHelperText - Default color otomatis
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: colors.gray,
        },
      },
    },
    // Link - Default color otomatis
    MuiLink: {
      styleOverrides: {
        root: {
          color: colors.gray,
          '&:hover': {
            color: colors.black,
          },
        },
      },
    },
    // Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          backgroundColor: colors.black,
          color: colors.white,
          '&:hover': {
            backgroundColor: colors.blackDark,
          },
        },
        outlined: {
          borderColor: colors.black,
          color: colors.black,
          '&:hover': {
            borderColor: colors.black,
            backgroundColor: 'rgba(38, 38, 38, 0.04)',
          },
        },
        text: {
          color: colors.black,
          '&:hover': {
            backgroundColor: 'rgba(38, 38, 38, 0.04)',
          },
        },
      },
    },
    // TextField / Input
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            color: colors.black,
          },
          '& .MuiInputLabel-root': {
            color: colors.black,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: colors.black,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.black,
            borderWidth: 1,
          },
        },
        input: {
          color: colors.black,
          '&::placeholder': {
            color: colors.gray,
            opacity: 1,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: colors.black,
        },
        input: {
          color: colors.black,
          '&::placeholder': {
            color: colors.gray,
            opacity: 1,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // Select
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: colors.black,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: colors.black,
          },
        },
      },
    },
    // Card
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        },
      },
    },
    // Paper
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    // Chip
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    // Menu
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    // Popover
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    // Tooltip
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
        },
      },
    },
    // Pagination
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            borderRadius: 8,
          },
        },
      },
    },
    // IconButton
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        colorInfo: {
          color: '#1976d2',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
          '& svg': {
            '--icon-color': '#1976d2',
          },
          '& svg path': {
            stroke: 'var(--icon-color)',
          },
        },
        colorSuccess: {
          color: '#2e7d32',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
          },
          '& svg': {
            '--icon-color': '#2e7d32',
          },
          '& svg path': {
            stroke: 'var(--icon-color)',
          },
        },
        colorError: {
          color: '#d32f2f',
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.08)',
          },
          '& svg': {
            '--icon-color': '#d32f2f',
          },
          '& svg path': {
            stroke: 'var(--icon-color)',
          },
        },
        colorWarning: {
          color: '#ed6c02',
          '&:hover': {
            backgroundColor: 'rgba(237, 108, 2, 0.08)',
          },
          '& svg': {
            '--icon-color': '#ed6c02',
          },
          '& svg path': {
            stroke: 'var(--icon-color)',
          },
        },
      },
    },
    // Tabs
    MuiTab: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // AppBar (Header) - No border radius
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    // Drawer (Sidebar) - No border radius
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
  },
});
