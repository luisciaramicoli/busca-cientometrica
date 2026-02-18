import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderIcon from '@mui/icons-material/Folder';
import Header from '../components/Header';
import { processDriveFolder } from '../api';

function BatchProcessDrivePage() {
  const [folderId, setFolderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleProcess = async () => {
    if (!folderId.trim()) {
      setSnackbar({ open: true, message: 'Digite o ID da pasta.', severity: 'error' });
      return;
    }

    setLoading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });

    try {
      const response = await processDriveFolder(folderId.trim());
      setSnackbar({ open: true, message: 'Processamento em lote iniciado com sucesso!', severity: 'success' });
      console.log(response);
    } catch (error) {
      console.error('Error processing drive folder:', error);
      setSnackbar({ open: true, message: 'Erro ao processar pasta do Drive.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mr: 2 }}>
            Voltar
          </Button>
          <Typography variant="h4" component="h1">
            Processamento em Lote do Google Drive
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Insira o ID da pasta do Google Drive para processar todos os arquivos em lote.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <TextField
              label="ID da Pasta"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              fullWidth
              placeholder="Ex: 1A2B3C4D5E6F7G8H9I0J"
            />
            <Button
              variant="contained"
              onClick={handleProcess}
              disabled={loading || !folderId.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <FolderIcon />}
            >
              {loading ? 'Processando...' : 'Processar'}
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default BatchProcessDrivePage;