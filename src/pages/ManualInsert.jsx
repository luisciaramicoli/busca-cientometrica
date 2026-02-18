import { useState, useEffect } from "react";
import {
  Container, Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert, Input, IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import Header from "../components/Header";
import { manualInsertArticle, extractMetadata, checkApiHealth, processDriveFolder } from '../api';

const ManualInsertPage = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    "Autor(es)": "N/A",
    Titulo: "N/A",
    Subtítulo: "N/A",
    Ano: "N/A",
    "Número de citações recebidas (Google Scholar)": "N/A",
    "Palavras-chave": "N/A",
    Resumo: "N/A",
    "Tipo de documento": "N/A",
    Editora: "N/A",
    Instituição: "N/A",
    Local: "N/A",
    "Tipo de trabalho": "N/A",
    "Título do periódico": "N/A",
    "Quartil do periódico": "N/A",
    Volume: "N/A",
    "Número/fascículo": "N/A",
    Páginas: "N/A",
    DOI: "N/A",
    Numeração: "N/A",
    Qualis: "N/A",
    pub_url: "N/A", // keep document URL but not other post-Qualis fields
  });

  // State for the extraction query
  const [searchTitle, setSearchTitle] = useState("");
  const [file, setFile] = useState(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State for batch processing
  const [folderId, setFolderId] = useState('');
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState('');
  const [batchSuccess, setBatchSuccess] = useState('');

  useEffect(() => {
    const apiHealthCheck = async () => {
      try {
        console.log("Checking Node.js API health...");
        const response = await checkApiHealth();
        console.log("Node.js API Health Check OK:", response);
      } catch (err) {
        console.error("Node.js API Health Check FAILED:", err);
      }
    };
    apiHealthCheck();
  }, []); // Empty dependency array means this runs once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtract = async () => {
    if (!searchTitle && !file) {
      setError("Por favor, forneça um título ou um arquivo PDF.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    
    const extractionData = new FormData();
    if (searchTitle) {
      extractionData.append('title', searchTitle);
    }
    if (file) {
      extractionData.append('file', file);
    }

    try {
      const response = await extractMetadata(extractionData);

      // Update form data with the extracted metadata
      // Only merge fields up to and including 'Qualis'
      setFormData(prev => {
        const allKeys = Object.keys(prev);
        const qualisIndex = allKeys.indexOf('Qualis');
        const allowedKeys = qualisIndex !== -1 ? allKeys.slice(0, qualisIndex + 1) : allKeys;
        const partial = {};
        allowedKeys.forEach((k) => {
          if (response && Object.prototype.hasOwnProperty.call(response, k)) {
            partial[k] = response[k];
          }
        });
        return {
          ...prev,
          ...partial,
        };
      });

      setSuccess("Metadados extraídos com sucesso! Revise e salve.");

    } catch (err) {
      console.error("Metadata extraction failed:", err);
      const errorMessage = err.response?.data?.detail || "Falha ao extrair metadados.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Map frontend state to the backend's expected 'manualInsert' schema
    const dataToSave = {
      "Autor(es)": formData["Autor(es)"],
      Titulo: formData.Titulo,
      Subtítulo: formData.Subtítulo,
      Ano: formData.Ano,
      "Número de citações recebidas (Google Scholar)": formData["Número de citações recebidas (Google Scholar)"],
      "Palavras-chave": formData["Palavras-chave"],
      Resumo: formData.Resumo,
      "Tipo de documento": formData["Tipo de documento"],
      Editora: formData.Editora,
      Instituição: formData.Instituição,
      Local: formData.Local,
      "Tipo de trabalho": formData["Tipo de trabalho"],
      "Título do periódico": formData["Título do periódico"],
      "Quartil do periódico": formData["Quartil do periódico"],
      Volume: formData.Volume,
      "Número/fascículo": formData["Número/fascículo"],
      Páginas: formData.Páginas,
      DOI: formData.DOI,
      Numeração: formData.Numeração,
      Qualis: formData.Qualis,
      pub_url: formData.pub_url,
    };
    
    try {
      const response = await manualInsertArticle(dataToSave, file);
      setSuccess(response.message || "Artigo salvo com sucesso!");
      // Optionally clear the form (only keep fields up to Qualis + pub_url)
      setFormData({
        "Autor(es)": "N/A",
        Titulo: "N/A",
        Subtítulo: "N/A",
        Ano: "N/A",
        "Número de citações recebidas (Google Scholar)": "N/A",
        "Palavras-chave": "N/A",
        Resumo: "N/A",
        "Tipo de documento": "N/A",
        Editora: "N/A",
        Instituição: "N/A",
        Local: "N/A",
        "Tipo de trabalho": "N/A",
        "Título do periódico": "N/A",
        "Quartil do periódico": "N/A",
        Volume: "N/A",
        "Número/fascículo": "N/A",
        Páginas: "N/A",
        DOI: "N/A",
        Numeração: "N/A",
        Qualis: "N/A",
        pub_url: "N/A",
      });
      setSearchTitle("");
      setFile(null);

    } catch (err) {
       console.error("Save failed:", err);
       const errorMessage = err.response?.data?.error || "Falha ao salvar o artigo.";
       setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchProcess = async () => {
    if (!folderId) {
      setBatchError("Por favor, insira o ID da Pasta do Google Drive.");
      return;
    }

    setBatchLoading(true);
    setBatchError('');
    setBatchSuccess('');

    try {
      const response = await processDriveFolder(folderId);
      setBatchSuccess(response.message || `Processamento em lote da pasta "${folderId}" iniciado com sucesso!`);
      setFolderId(''); // Clear folder ID after initiating process
    } catch (err) {
      console.error("Batch processing failed:", err);
      const errorMessage = err.response?.data?.error || "Falha ao iniciar o processamento em lote.";
      setBatchError(errorMessage);
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <Box>
      <Header />
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton component={RouterLink} to="/home" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Inserção Manual de Artigos
          </Typography>
        </Box>

        {/* Batch Processing Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>1. Inserção em Lote via Google Drive</Typography>
          <TextField
            label="ID da Pasta do Google Drive"
            variant="outlined"
            fullWidth
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            sx={{ mb: 2 }}
            disabled={batchLoading}
          />
          <Button
            variant="contained"
            startIcon={batchLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            fullWidth
            onClick={handleBatchProcess}
            disabled={batchLoading || !folderId}
          >
            {batchLoading ? 'Processando...' : 'Processar Artigos da Pasta'}
          </Button>
          {batchError && <Alert severity="error" sx={{ mt: 2 }}>{batchError}</Alert>}
          {batchSuccess && <Alert severity="success" sx={{ mt: 2 }}>{batchSuccess}</Alert>}
        </Paper>

        {/* Extraction Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>2. Extrair Metadados (Opcional)</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} sm={7}>
              <TextField
                label="Buscar por Título do Artigo"
                variant="outlined"
                fullWidth
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                disabled={loading}
              />
            </Grid>
            <Grid xs={12} sm={1} sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary">OU</Typography>
            </Grid>
            <Grid xs={12} sm={4}>
               <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload PDF
                <input type="file" hidden onChange={handleFileChange} accept="application/pdf" />
              </Button>
              {file && <Typography variant="caption" display="block" sx={{mt: 1, textAlign: 'center'}}>{file.name}</Typography>}
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleExtract}
              disabled={loading || (!searchTitle && !file)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            >
              {loading ? 'Extraindo...' : 'Extrair Dados'}
            </Button>
          </Box>
        </Paper>

        {/* Form Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
           <Typography variant="h6" gutterBottom>2. Revisar e Salvar Dados</Typography>
           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
           {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
           <Grid container spacing={2}>
              {Object.keys(formData).map((key) => (
                <Grid size={{ xs: 12, sm: (key === 'Título' || key === 'Autor(es)' ? 12 : 6), md: (key === 'Título' || key === 'Autor(es)' ? 6 : 4) }} key={key}>
                  <TextField
                    name={key}
                    label={key.replace('_', ' ')}
                    value={formData[key]}
                    onChange={handleInputChange}
                    fullWidth
                    variant="filled"
                  />
                </Grid>
              ))}
           </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading || !formData.Titulo}
              >
                {loading ? 'Salvando...' : 'Salvar Artigo na Planilha'}
              </Button>
            </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ManualInsertPage;
