import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActionArea 
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

function HomePage() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const menuItems = [
    {
      title: "Busca Cientométrica",
      description: "Pesquise artigos em múltiplas bases de dados.",
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      path: "/search",
      color: "primary.main"
    },
    {
      title: "Curadoria",
      description: "Gerencie e classifique seus artigos salvos.",
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      path: "/curation",
      color: "secondary.main"
    },
    {
      title: "Inserção Manual",
      description: "Adicione artigos manualmente ao sistema.",
      icon: <PlaylistAddIcon sx={{ fontSize: 40 }} />,
      path: "/manual-insert",
      color: "success.main"
    }
  ];

  if (userRole === 'admin') {
    menuItems.push({
      title: "Cadastrar Usuário",
      description: "Gerencie o acesso de novos pesquisadores.",
      icon: <PersonAddIcon sx={{ fontSize: 40 }} />,
      path: "/register-user",
      color: "info.main"
    });
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {menuItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' } }}>
                <CardActionArea onClick={() => navigate(item.path)} sx={{ height: '100%', p: 2 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: item.color, mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
