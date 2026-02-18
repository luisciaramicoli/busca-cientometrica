import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SpeedIcon from "@mui/icons-material/Speed";
import StorageIcon from "@mui/icons-material/Storage";
import "./Landing.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <SearchIcon fontSize="large" />,
      title: "Busca Multi-Base",
      description:
        "Integração direta com o OpenAlex e outras bases científicas globais para resultados precisos.",
    },
    {
      icon: <AutoFixHighIcon fontSize="large" />,
      title: "IA na Curadoria",
      description:
        "Nossa IA analisa metadados e resumos para classificar automaticamente a relevância dos artigos.",
    },
    {
      icon: <StorageIcon fontSize="large" />,
      title: "Gestão Centralizada",
      description:
        "Salve e organize sua produção científica diretamente em planilhas e pastas do Google Drive.",
    },
  ];

  const stats = [
    { label: "Bases de Dados", value: "5+" },
    { label: "Artigos Analisados", value: "10k+" },
    { label: "Precisão da IA", value: "98%" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white", overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        className="hero-gradient"
        sx={{
          pt: { xs: 10, md: 20 },
          pb: { xs: 10, md: 25 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid
              item
              xs={12}
              md={7}
              sx={{ textAlign: { xs: "center", md: "left" }, zIndex: 2 }}
            >
              <Typography
                variant="overline"
                sx={{
                  color: "primary.light",
                  fontWeight: 900,
                  letterSpacing: 4,
                  mb: 2,
                  display: "block",
                  textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                PROXIMA GERAÇÃO DE PESQUISA
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  color: "white",
                  fontSize: { xs: "3rem", sm: "4rem", md: "5.5rem" },
                  lineHeight: 1,
                  mb: 3,
                  letterSpacing: "-0.02em",
                }}
              >
                A ciência pede <br />
                <Box component="span" sx={{ color: "secondary.main" }}>
                  inteligência.
                </Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 6,
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 400,
                  fontSize: { xs: "1.1rem", md: "1.4rem" },
                  maxWidth: "600px",
                  lineHeight: 1.6,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                Automatize sua revisão sistemática. Da busca bibliográfica à
                curadoria final, reduzimos o trabalho manual em até 80%.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 2.5,
                    px: 6,
                    borderRadius: "50px",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    "&:hover": { transform: "scale(1.05)", transition: "0.2s" },
                  }}
                >
                  Acessar Plataforma
                </Button>
                <Button
                  variant="text"
                  size="large"
                  onClick={() =>
                    document
                      .getElementById("features")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  Conheça os recursos ↓
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>

        {/* Floating Decorative Elements */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              right: "-5%",
              top: "15%",
              opacity: 0.2,
              zIndex: 1,
              animation: "float 10s ease-in-out infinite",
            }}
          >
            <ScienceIcon sx={{ fontSize: 600, color: "white" }} />
          </Box>
        )}
      </Box>

      {/* Features Section */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 15, md: 20 } }}>
        <Box sx={{ mb: 10, textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, mb: 2, letterSpacing: "-0.02em" }}
          >
            Potencialize sua <br /> produtividade científica.
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "grey.600", fontWeight: 400, maxWidth: "700px" }}
          >
            Desenvolvemos ferramentas específicas para pesquisadores que não têm
            tempo a perder com processos repetitivos.
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ p: 2 }}>
                <Avatar
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "primary.main",
                    mb: 4,
                    boxShadow: "0 10px 20px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "grey.600",
                    lineHeight: 1.8,
                    fontSize: "1.1rem",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Modern CTA Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          py: { xs: 10, md: 15 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth="md"
          sx={{ textAlign: "center", position: "relative", zIndex: 2 }}
        >
          <Typography
            variant="h3"
            sx={{ color: "white", fontWeight: 900, mb: 4 }}
          >
            Pronto para transformar sua metodologia?
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "rgba(255,255,255,0.8)", mb: 6, fontWeight: 400 }}
          >
            Junte-se a pesquisadores que já estão utilizando inteligência de
            dados para acelerar suas descobertas.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              py: 2,
              px: 8,
              borderRadius: "50px",
              fontWeight: 900,
              fontSize: "1.2rem",
              boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
            }}
          >
            Entrar Agora
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 8,
          bgcolor: "white",
          borderTop: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ScienceIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, letterSpacing: -0.5 }}
              >
                Cientometria
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.500">
              © {new Date().getFullYear()} Plataforma de Cientometria.
              Desenvolvido para a excelência acadêmica.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, cursor: "pointer" }}
              >
                Sobre
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, cursor: "pointer" }}
              >
                Privacidade
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, cursor: "pointer" }}
              >
                Contato
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
