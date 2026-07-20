import { createTheme } from '@mui/material/styles'

const FONT_BODY = "'Inter', sans-serif"
const FONT_DISPLAY = "'Space Grotesk', sans-serif"
export const FONT_MONO = "'JetBrains Mono', monospace"

declare module '@mui/material/styles' {
  interface Palette {
    link: { main: string }
    kanbanStatus: { open: string; inProgress: string; resolved: string }
    avatarContrastText: string
  }
  interface PaletteOptions {
    link?: { main: string }
    kanbanStatus?: { open: string; inProgress: string; resolved: string }
    avatarContrastText?: string
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F5F6F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#171A21',
      secondary: '#5B6472',
      disabled: '#8890A0',
    },
    divider: '#E3E6EB',
    primary: {
      main: '#0D9488',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A78BFA',
    },
    warning: {
      main: '#F0B429',
    },
    error: {
      main: '#FB7185',
    },
    link: {
      main: '#3B82F6',
    },
    kanbanStatus: {
      open: '#8B92A3',
      inProgress: '#F0B429',
      resolved: '#5EEAD4',
    },
    avatarContrastText: '#0B1210',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: FONT_BODY,
    h5: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
    h6: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
    overline: { fontWeight: 600, letterSpacing: '0.06em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.palette.text.primary}0D 1px, transparent 1px)`,
          backgroundSize: '22px 22px',
        },
      }),
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.link.main,
          textDecorationColor: 'currentColor',
          '&:visited': { color: theme.palette.link.main },
          '&:hover': { color: theme.palette.link.main, textDecoration: 'underline' },
          '&:active': { color: theme.palette.link.main },
        }),
      },
    },
  },
})
