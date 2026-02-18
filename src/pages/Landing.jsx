import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  Paper
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Header from "../components/Header";
import "./Landing.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Breakpoints para ajustes finos
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main' }} />,
      title: "Busca Inteligente",
      description: "Pesquise em bases de dados científicas de forma integrada e eficiente."
    },
    {
      icon: <AutoFixHighIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main' }} />,
      title: "Curadoria Automatizada",
      description: "Utilize IA para classificar e organizar artigos relevantes para sua pesquisa."
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: { xs: 40, md: 50 }, color: 'primary.main' }} />,
      title: "Visualização de Dados",
      description: "Acompanhe métricas cientométricas essenciais em uma interface intuitiva."
    }
  ];

  const steps = [
    { number: "1", title: "Faça Login", text: "Acesse sua conta para começar." },
    { number: "2", title: "Pesquise", text: "Encontre artigos em diversas bases." },
    { number: "3", title: "Cure", text: "Classifique os artigos com ajuda de IA." },
    { number: "4", title: "Exporte", text: "Obtenha dados prontos para análise." }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <Header />
      
      {/* Hero Section */}
      <Box className="hero-section" sx={{ py: { xs: 6, sm: 10, md: 15 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800, 
                  color: 'white',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1.1
                }}
              >
                Cientometria <br/> Facilitada
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 5, 
                  color: 'rgba(255,255,255,0.9)', 
                  fontWeight: 300,
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  maxWidth: { md: '90%' }
                }}
              >
                A plataforma completa para busca, curadoria automatizada e análise de produção científica em um só lugar.
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  color="secondary"
                  onClick={() => navigate("/login")}
                  sx={{ 
                    py: 2, 
                    px: 4, 
                    borderRadius: 3, 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 14px 0 rgba(0,0,0,0.3)'
                  }}
                >
                  Começar Agora
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white', 
                    py: 2, 
                    px: 4, 
                    borderRadius: 3, 
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2, borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } 
                  }}
                >
                  Saiba Mais
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <ScienceIcon sx={{ fontSize: { md: 300, lg: 400 }, color: 'rgba(255,255,255,0.15)', animation: 'float 6s ease-in-out infinite' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 10, md: 15 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography 
            variant="overline" 
            sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2, fontSize: '1rem' }}
          >
            RECURSOS PODEROSOS
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mt: 1,
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              color: 'grey.900'
            }}
          >
            Tudo o que você precisa <br/> para sua pesquisa
          </Typography>
          <Box sx={{ width: 80, height: 4, bgcolor: 'primary.main', mx: 'auto', mt: 3, borderRadius: 2 }} />
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 4, md: 5, lg: 6 },
                  width: '100%',
                  textAlign: 'left', 
                  bgcolor: 'white', 
                  borderRadius: 6, 
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  border: '1px solid',
                  borderColor: 'grey.100',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                  '&:hover': { 
                    transform: 'translateY(-12px)', 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    '& .icon-box': {
                      transform: 'scale(1.1)',
                      bgcolor: 'primary.main',
                      color: 'white'
                    },
                    '&::before': {
                      height: '6px'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '0px',
                    bgcolor: 'primary.main',
                    transition: '0.3s'
                  }
                }}
              >
                <Box 
                  className="icon-box"
                  sx={{ 
                    mb: 3, 
                    display: 'inline-flex', 
                    p: 2, 
                    borderRadius: '20px', 
                    bgcolor: 'primary.light', 
                    color: 'primary.main',
                    transition: '0.4s'
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: 'grey.900', mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1rem' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 12 }, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            textAlign="center" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              mb: { xs: 6, md: 10 },
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Como funciona?
          </Typography>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Stack spacing={3} alignItems="center" textAlign="center">
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '24px', 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: 32,
                    fontWeight: 800,
                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                    transform: 'rotate(-5deg)'
                  }}>
                    {step.number}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{step.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>{step.text}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto', py: 6, textAlign: 'center', bgcolor: 'grey.900', color: 'rgba(255,255,255,0.6)' }}>
        <Container maxWidth="lg">
            <ScienceIcon sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                Busca Cientométrica
            </Typography>
            <Typography variant="body2">
            © {new Date().getFullYear()} Todos os direitos reservados.
            </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
