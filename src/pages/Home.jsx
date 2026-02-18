import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd"; // Ícone para inserção
import Header from "../components/Header"; // Reutilizando o Header
import "./Home.css";

function HomePage() {
  const navigate = useNavigate();

  // TODO: Adicionar função de Logout

  return (
    <Box className="page-container">
      <Header />
      <Container component="main" maxWidth="md" className="home-content">
        {" "}
        {/* Aumentado para md para caber 3 botões */}
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bem-vindo
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Selecione uma das opções abaixo para continuar.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={() => navigate("/search")}
            >
              Busca Cientométrica
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArticleIcon />}
              onClick={() => navigate("/curation")}
            >
              Ver Curadoria
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<PlaylistAddIcon />}
              onClick={() => navigate("/manual-insert")}
            >
              Inserir Manualmente
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default HomePage;
