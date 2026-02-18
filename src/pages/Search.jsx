import { useState } from 'react';
import { Container, Box, Snackbar, Alert, Typography, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';
import "./Search.css";
import { searchArticles, saveArticles } from '../api';

function SearchPage() {
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSearch = async (searchParams) => {
    setSearchLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      const response = await searchArticles(searchParams);
      setResults(response);
      if (response.length === 0) {
        setSnackbar({ open: true, message: 'Nenhum resultado encontrado.', severity: 'info' });
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSnackbar({ open: true, message: 'Erro ao buscar resultados.', severity: 'error' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSave = async (selectedRows) => {
    setSaveLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });
    try {
      await saveArticles(selectedRows);
      setSnackbar({ open: true, message: 'Dados salvos com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Error saving:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar dados.', severity: 'error' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="page-container">
      <Header />
      <Container component="main" className="main-content" maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <IconButton component={RouterLink} to="/" sx={{ mr: 1, color: 'inherit' }}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                Busca de Artigos
            </Typography>
        </Box>
        <SearchForm onSearch={handleSearch} loading={searchLoading} />
        {results.length > 0 && (
          <Box mt={4}>
            <ResultsTable results={results} onSave={handleSave} loading={saveLoading} />
          </Box>
        )}
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SearchPage;
