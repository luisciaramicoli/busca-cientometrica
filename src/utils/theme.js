import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // Um azul clássico
        },
        secondary: {
            main: '#424242', // Um cinza escuro
        },
        background: {
            default: '#f4f6f8', // Fundo cinza claro
            paper: '#ffffff', // Branco para cartões e papéis
        },
        text: {
            primary: '#212121', // Cinza escuro para o texto principal
            secondary: '#5f6368', // Cinza mais claro para texto secundário
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontFamily: '"Roboto Slab", serif',
            fontWeight: 700,
        },
        h2: {
            fontFamily: '"Roboto Slab", serif',
            fontWeight: 700,
        },
        h3: {
            fontFamily: '"Roboto Slab", serif',
            fontWeight: 700,
        },
        h4: {
            fontFamily: '"Roboto Slab", serif',
            fontWeight: 600,
        },
        h5: {
            fontFamily: '"Roboto Slab", serif',
            fontWeight: 600,
        },
        h6: {
            fontFamily: '"Roboto Slab", serif',
            fontWeight: 600,
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#212121',
                    borderBottom: '1px solid #e0e0e0'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }
            }
        }
    }
});

export default theme;