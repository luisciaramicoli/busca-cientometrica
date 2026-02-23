import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  Container
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import LogoutIcon from '@mui/icons-material/Logout';
import ScienceIcon from '@mui/icons-material/Science';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const { isAuthenticated, logout, userRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const menuItems = [
    { text: 'Busca', icon: <SearchIcon />, path: '/search', show: isAuthenticated },
    { text: 'Inserção Manual', icon: <PlaylistAddIcon />, path: '/manual-insert', show: isAuthenticated },
    { text: 'Curadoria', icon: <ArticleIcon />, path: '/curation', show: isAuthenticated },
    { text: 'Cadastrar Usuário', icon: <PersonAddIcon />, path: '/register-user', show: isAuthenticated && userRole === 'admin' },
    { text: 'Gerenciar Usuários', icon: <PersonAddIcon />, path: '/user-management', show: isAuthenticated && userRole === 'admin' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ScienceIcon color="primary" />
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          Cientometria
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem component={RouterLink} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        {menuItems.filter(item => item.show).map((item) => (
          <ListItem key={item.text} component={RouterLink} to={item.path}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {!isAuthenticated ? (
          <ListItem component={RouterLink} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        ) : (
          <ListItem onClick={handleLogout}>
            <ListItemText primary="Sair" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0} 
        sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'divider', 
          backdropFilter: 'blur(8px)',
          bgcolor: 'rgba(255, 255, 255, 0.9)', 
          color: 'text.primary',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton
              edge="start"
              color="primary"
              aria-label="home"
              component={RouterLink}
              to="/"
              sx={{ mr: 1 }}
            >
              <ScienceIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'inherit', 
                fontWeight: 700,
                letterSpacing: '-0.5px'
              }}
            >
              Busca Cientométrica
            </Typography>
            
            {isMobile ? (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {menuItems.filter(item => item.show).map((item) => (
                  <Button key={item.text} color="inherit" component={RouterLink} to={item.path} sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Button>
                ))}
                {!isAuthenticated ? (
                  <Button variant="contained" component={RouterLink} to="/login" sx={{ ml: 2, borderRadius: 2 }}>
                    Login
                  </Button>
                ) : (
                  <Button color="error" startIcon={<LogoutIcon />} onClick={handleLogout} sx={{ ml: 2 }}>
                    Sair
                  </Button>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
