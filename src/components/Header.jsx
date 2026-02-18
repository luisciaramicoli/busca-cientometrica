import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import ScienceIcon from '@mui/icons-material/Science';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Import new icon
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout, userRole } = useAuth(); // Get userRole

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          component={RouterLink}
          to="/"
          sx={{ mr: 1 }}
        >
          <ScienceIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Busca Cientométrica
        </Typography>
        
        {isAuthenticated && (
          <>
            <Button color="inherit" component={RouterLink} to="/search">
              Busca
            </Button>
            <Button color="inherit" component={RouterLink} to="/manual-insert">
              Inserção Manual
            </Button>
            <Button color="inherit" component={RouterLink} to="/curation">
              Curadoria
            </Button>
            {userRole === 'admin' && ( // Conditionally render for admin role
              <Button color="inherit" component={RouterLink} to="/register-user" startIcon={<PersonAddIcon />}>
                Cadastrar Usuário
              </Button>
            )}
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
              Sair
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
