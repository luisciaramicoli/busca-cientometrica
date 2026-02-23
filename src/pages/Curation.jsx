import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TablePagination,
  Snackbar,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../components/Header";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ScienceIcon from "@mui/icons-material/Science";
import ClearIcon from "@mui/icons-material/Clear";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import "./Curation.css";
import { getCuratedArticles, triggerBatchCuration, triggerSingleCuration, categorizeArticleRow, deleteArticleRow, deleteUnavailableArticles, manualApproveArticle } from '../api';
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook

function CurationPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado para destacar um único artigo
  const [highlightedArticleId, setHighlightedArticleId] = useState(null);

  // Estado para o Modal de Visualização de PDF
  const [previewUrl, setPreviewUrl] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);

  // Estado para o Modal de Resultado da Análise (Evidência)
  const [analysisResult, setAnalysisResult] = useState(null);
  const [openAnalysisDialog, setOpenAnalysisDialog] = useState(false);

  const [allHeaders, setAllHeaders] = useState([]);
  const [visibleHeaders, setVisibleHeaders] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [order, setOrder] = useState("asc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [isTriggering, setIsTriggering] = useState(false);
  const [processingRow, setProcessingRow] = useState(null);

  const fetchArticles = useCallback(async () => {
    setError("");
    try {
      const data = await getCuratedArticles();
      setArticles(data);

      if (data.length > 0) {
        // Use keys from the first article directly as headers if allHeaders is not set
        const originalHeaders = Object.keys(data[0]);
        const filteredHeaders = originalHeaders.filter(
          (h) =>
            h !== "APROVAÇÃO CURADOR (marcar)" && 
            h !== "ARTIGOS REJEITADOS" && 
            h !== "__row_number" &&
            h !== "APROVAÇÃO MANUAL"
        );
        const newHeaders = ["Status", ...filteredHeaders];
        setAllHeaders(newHeaders);
        setVisibleHeaders(newHeaders);

        // Extract unique categories
        const categories = [...new Set(data.map(article => article["CATEGORIA"]).filter(cat => cat))];
        setUniqueCategories(categories);
      }
    } catch (err) {
      console.error("Failed to fetch curated articles:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Não foi possível carregar os artigos da curadoria.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [allHeaders.length]);

  useEffect(() => {
    setLoading(true);
    fetchArticles();
  }, [fetchArticles]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTriggerCuration = async () => {
    setIsTriggering(true);
    setSnackbar({
      open: true,
      message: "Acionando curadoria em lote...",
      severity: "info",
    });
    try {
      const response = await triggerBatchCuration();
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
      setTimeout(fetchArticles, 2000);
    } catch (err) {
      console.error("Failed to trigger curation script:", err);
      const errorMessage =
        err.response?.data?.error || "Falha ao acionar a curadoria em lote.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsTriggering(false);
    }
  };

  const handleSingleCuration = async (articleToProcess) => {
    const { __row_number } = articleToProcess;
    if (!__row_number) {
      setSnackbar({
        open: true,
        message:
          "Erro: Não foi possível determinar o número da linha para este artigo.",
        severity: "error",
      });
      return;
    }

    setProcessingRow(__row_number); // Rastreia pelo número da linha
    setSnackbar({
      open: true,
      message: `Analisando linha ${__row_number}...`,
      severity: "info",
    });

    try {
      const response = await triggerSingleCuration(__row_number);

      // SUCESSO: Guarda o resultado e abre o modal, NÃO atualiza a lista ainda
      setAnalysisResult(response.updatedArticle);
      setOpenAnalysisDialog(true);
      setSnackbar({ open: false, message: "", severity: "info" }); // Limpa snackbar para focar no modal
    } catch (err) {
      console.error(
        `Failed to trigger single curation for row ${__row_number}:`,
        err,
      );
      const errorMessage =
        err.response?.data?.error ||
        `Falha ao analisar a linha ${__row_number}.`;
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setProcessingRow(null);
    }
  };

  const handleSingleCategorize = async (articleToProcess) => {
    const { __row_number } = articleToProcess;
    if (!__row_number) {
      setSnackbar({
        open: true,
        message:
          "Erro: Não foi possível determinar o número da linha para este artigo.",
        severity: "error",
      });
      return;
    }

    setProcessingRow(__row_number); // Rastreia pelo número da linha
    setSnackbar({
      open: true,
      message: `Categorizando linha ${__row_number}...`,
      severity: "info",
    });

    try {
      const response = await categorizeArticleRow(__row_number);

      // SUCESSO: Guarda o resultado e abre o modal, NÃO atualiza a lista ainda
      setAnalysisResult(response.updatedArticle);
      setOpenAnalysisDialog(true);
      setSnackbar({ open: false, message: "", severity: "info" }); // Limpa snackbar para focar no modal
    } catch (err) {
      console.error(
        `Failed to categorize row ${__row_number}:`,
        err,
      );
      const errorMessage =
        err.response?.data?.error ||
        `Falha ao categorizar a linha ${__row_number}.`;
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setProcessingRow(null);
    }
  };

  const handleCloseAnalysisDialog = () => {
    setOpenAnalysisDialog(false);
    setAnalysisResult(null);
    setHighlightedArticleId(null); // Limpa o destaque antes

    // Pequeno delay para garantir que o modal fechou antes de atualizar o grid
    setTimeout(() => {
      fetchArticles();
      setStatusFilter("all");
      setSearchQuery("");
    }, 100);
  };

  const handleSingleDelete = async (article) => {
    const { __row_number } = article;
    if (
      !__row_number ||
      !window.confirm(
        `Tem certeza que deseja excluir o artigo "${article["Titulo"]}" (Linha ${__row_number})?`,
      )
    ) {
      return;
    }

    setSnackbar({
      open: true,
      message: `Excluindo linha ${__row_number}...`,
      severity: "info",
    });

    try {
      await deleteArticleRow(__row_number);
      setSnackbar({
        open: true,
        message: "Artigo excluído com sucesso.",
        severity: "success",
      });
      fetchArticles(); // Refresh list
    } catch (err) {
      console.error(`Failed to delete row ${__row_number}:`, err);
      setSnackbar({
        open: true,
        message: "Erro ao excluir artigo.",
        severity: "error",
      });
    }
  };

  const handleDeleteUnavailable = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja excluir TODOS os artigos marcados como 'Indisponíveis' (sem URL de documento)? Essa ação não pode ser desfeita.",
      )
    ) {
      return;
    }

    setSnackbar({
      open: true,
      message: "Excluindo artigos indisponíveis...",
      severity: "info",
    });

    try {
      const response = await deleteUnavailableArticles();
      setSnackbar({
        open: true,
        message: response.message,
        severity: "success",
      });
      fetchArticles(); // Refresh list
    } catch (err) {
      console.error(`Failed to delete unavailable rows:`, err);
      setSnackbar({
        open: true,
        message: "Erro ao excluir artigos indisponíveis.",
        severity: "error",
      });
    }
  };

  const handleManualApproval = async (article) => {
    const { __row_number } = article;
    const fileName = article["URL DO DOCUMENTO"];

    if (!fileName) {
      setSnackbar({
        open: true,
        message: "Este artigo não tem um arquivo local associado para ser aprovado.",
        severity: "warning",
      });
      return;
    }

    if (
      !window.confirm(
        `Tem certeza que deseja aprovar manualmente o artigo "${article["Titulo"]}" (Linha ${__row_number})? Uma cópia do arquivo será enviada para a pasta de aprovados local.`,
      )
    ) {
      return;
    }

    setSnackbar({
      open: true,
      message: `Aprovando manualmente a linha ${__row_number}...`,
      severity: "info",
    });

    try {
      await manualApproveArticle(__row_number, fileName);
      setSnackbar({
        open: true,
        message: "Artigo aprovado manualmente com sucesso!",
        severity: "success",
      });
      fetchArticles(); // Refresh list
    } catch (err) {
      console.error(`Failed to manually approve row ${__row_number}:`, err);
      const errorMessage =
        err.response?.data?.error || "Erro ao aprovar artigo manualmente.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleClearHighlight = () => {
    setHighlightedArticleId(null);
  };

  const handlePreviewPdf = (url) => {
    if (!url) return;

    // Se a URL não for completa (começar com http), assume que é um arquivo local servido pelo backend
    let finalUrl = url;
    if (!url.startsWith("http")) {
      // VITE_API_BASE_URL is usually something like http://172.26.0.3:5001/api
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://172.26.0.3:5001/api";
      const serverUrl = apiBaseUrl.replace(/\/api\/?$/, ""); // Remove /api at the end
      finalUrl = `${serverUrl}/documents/${url}`;
    } else if (url.includes("drive.google.com/file/d/")) {
      finalUrl = url.replace("/view", "/preview");
    }

    setPreviewUrl(finalUrl);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setPreviewUrl(null);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusInfo = (article) => {
    const isApprovedManual =
      (article["APROVAÇÃO MANUAL"] || "").toString().trim().toUpperCase() ===
      "TRUE";
    const isApprovedAI =
      (article["APROVAÇÃO CURADOR (marcar)"] || "")
        .toString()
        .trim()
        .toUpperCase() === "TRUE";
    const isRejectedAI =
      (article["ARTIGOS REJEITADOS"] || "").toString().trim().toUpperCase() ===
      "TRUE";
    const urlDocumento = (article["URL DO DOCUMENTO"] || "").toString().trim();
    const isLocalFile = urlDocumento !== "" && !urlDocumento.startsWith("http");

    if (isApprovedManual)
      return {
        status: "manual_approved",
        color: "primary",
        label: "Aprovado Manualmente",
        icon: <CheckCircleIcon />,
      };
    if (!isLocalFile)
      return {
        status: "unavailable",
        color: "secondary",
        label: "Indisponível (Sem arquivo local)",
        icon: <BlockIcon />,
      };
    if (isApprovedAI)
      return {
        status: "approved_ai",
        color: "success",
        label: "Aprovado (IA)",
        icon: <CheckCircleIcon />,
      };
    if (isRejectedAI)
      return {
        status: "rejected_ai",
        color: "error",
        label: "Rejeitado (IA)",
        icon: <CancelIcon />,
      };
    return {
      status: "pending",
      color: "warning",
      label: "Pendente",
      icon: <HourglassEmptyIcon />,
    };
  };

  useEffect(() => {
    setPage(0);
  }, [searchQuery, statusFilter, categoryFilter, highlightedArticleId]);

  const { userRole } = useAuth(); // Get user role from AuthContext

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (highlightedArticleId) {
      result = articles.filter((a) => a.id === highlightedArticleId);
    } else {
      result = articles.filter((article) => {
        const { status } = getStatusInfo(article);
        let matchesStatus = false;

        if (statusFilter === "all") {
          matchesStatus = true;
        } else {
          matchesStatus = status === statusFilter;
        }

        const query = searchQuery.toLowerCase().trim();
        const title = (article["Titulo"] || "").toLowerCase();
        const author = (article["Autor(es)"] || "").toLowerCase();
        const matchesSearch =
          query === "" || title.includes(query) || author.includes(query);

        const matchesCategory = categoryFilter === "all" || article["CATEGORIA"] === categoryFilter;

        return matchesStatus && matchesSearch && matchesCategory;
      });
    }

    // Ordenação
    return [...result].sort((a, b) => {
      // Forçar ordenação por número da linha
      const forcedOrderBy = "__row_number";

      let aValue = a[forcedOrderBy] || "";
      let bValue = b[forcedOrderBy] || "";

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      // Tenta converter para número se for o caso (ex: Ano)
      const aNum = Number(aValue);
      const bNum = Number(bValue);
      if (!isNaN(aNum) && !isNaN(bNum) && aValue !== "" && bValue !== "") {
        return order === "asc" ? aNum - bNum : bNum - aNum;
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [articles, statusFilter, searchQuery, highlightedArticleId, order, userRole]);

  const paginatedArticles = filteredArticles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box className="curation-container">
      <Header />
      <Container component="main" className="main-content" maxWidth="xl">
        <Box className="curation-header">
          <Box className="curation-header-title">
            <IconButton component={RouterLink} to="/" sx={{ mr: 1, color: "inherit" }} className="curation-back-button">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Artigos em Curadoria
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="curation-actions-stack">
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={handleTriggerCuration}
              disabled={isTriggering || processingRow}
              className="curation-action-button curation-action-primary"
            >
              {isTriggering
                ? "Processando Lote..."
                : "Analisar Pendentes"}
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteUnavailable}
              disabled={isTriggering || processingRow}
              className="curation-action-button curation-action-danger"
            >
              Excluir Indisponíveis
            </Button>
          </Stack>
        </Box>

        <Paper elevation={1} sx={{ p: 2, mb: 4 }} className="curation-filters">
          {highlightedArticleId ? (
            <Alert
              severity="info"
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={handleClearHighlight}
                >
                  Limpar Filtro
                </Button>
              }
            >
              Exibindo apenas o artigo recém-analisado.
            </Alert>
          ) : (
            <>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }} className="curation-summary-title">
                Resumo da Curadoria
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }} className="curation-summary">
                <Grid item xs={6} sm={3} className="summary-item">
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'primary.contrastText', fontWeight: 'bold' }}>
                      {articles.filter(a => {
                        const status = getStatusInfo(a).status;
                        return status === 'manual_approved' || status === 'approved_ai';
                      }).length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.contrastText' }}>
                      Aprovados
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} className="summary-item">
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'warning.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'warning.contrastText', fontWeight: 'bold' }}>
                      {articles.filter(a => getStatusInfo(a).status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'warning.contrastText' }}>
                      Pendentes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} className="summary-item">
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'error.light', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'error.contrastText', fontWeight: 'bold' }}>
                      {articles.filter(a => getStatusInfo(a).status === 'rejected_ai').length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.contrastText' }}>
                      Rejeitados
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3} className="summary-item">
                  <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'grey.300', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ color: 'grey.800', fontWeight: 'bold' }}>
                      {articles.filter(a => getStatusInfo(a).status === 'unavailable').length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.800' }}>
                      Indisponíveis
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid
                container
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item xs={12} className="filter-group">
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
                  >
                    Filtrar por Status
                  </Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={statusFilter}
                    exclusive
                    onChange={(e, newFilter) =>
                      newFilter && setStatusFilter(newFilter)
                    }
                    aria-label="filtro de status"
                    size="small"
                  >
                    <ToggleButton value="all">Todos</ToggleButton>
                    <ToggleButton
                      value="manual_approved"
                      sx={{ color: "primary.dark" }}
                    >
                      Aprovados Manualmente
                    </ToggleButton>
                    <ToggleButton
                      value="approved_ai"
                      sx={{ color: "success.dark" }}
                    >
                      Aprovados (IA)
                    </ToggleButton>
                    <ToggleButton value="pending" sx={{ color: "warning.dark" }}>
                      Pendentes
                    </ToggleButton>
                    <ToggleButton
                      value="rejected_ai"
                      sx={{ color: "error.dark" }}
                    >
                      Rejeitados
                    </ToggleButton>
                    <ToggleButton
                      value="unavailable"
                      sx={{ color: "secondary.dark" }}
                    >
                      Indisponíveis
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }} className="filter-row">
                <Grid item xs={12} md={4} className="filter-group">
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
                  >
                    Filtrar por Categoria
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-filter-label">Categoria</InputLabel>
                    <Select
                      labelId="category-filter-label"
                      value={categoryFilter}
                      label="Categoria"
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <MenuItem value="all">Todas</MenuItem>
                      {uniqueCategories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={5} className="filter-group">
                  <TextField
                    label="Buscar por Título ou Autor"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3} className="filter-group">
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: "bold", color: "text.secondary" }}
                  >
                    Ordem
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel id="curation-order-label">Ordem</InputLabel>
                    <Select
                      labelId="curation-order-label"
                      value={order}
                      label="Ordem"
                      onChange={(e) => setOrder(e.target.value)}
                    >
                      <MenuItem value="asc">Crescente</MenuItem>
                      <MenuItem value="desc">Decrescente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
        </Paper>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }} className="curation-loading">
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Carregando artigos...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }} className="curation-error">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3} className="curation-card-grid">
              {paginatedArticles.map((article, index) => {
                const statusInfo = getStatusInfo(article);
                const isProcessingThisRow =
                  processingRow === article.__row_number;

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={article.id || article.__row_number || index}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderTop: `5px solid`,
                        borderColor: `${statusInfo.color}.main`,
                        opacity: isProcessingThisRow ? 0.7 : 1,
                        transition: '0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                      className="curation-card"
                    >
                      <CardHeader
                        action={
                          <Chip
                            icon={statusInfo.icon}
                            label={statusInfo.label}
                            color={statusInfo.color}
                            size="small"
                          />
                        }
                        title={article["Titulo"] || "No Title"}
                        titleTypographyProps={{
                          variant: "h6",
                          style: {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          },
                        }}
                        sx={{ pb: 1, alignItems: "flex-start" }}
                        className="curation-card-header"
                      />
                      {article["CATEGORIA"] && (
                        <Box sx={{ px: 2, pb: 1 }}>
                          <Chip
                            label={`Categoria: ${article["CATEGORIA"]}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </Box>
                      )}
                      <CardContent
                        sx={{ flexGrow: 1, pt: 0, overflowY: "auto", maxHeight: 400 }}
                        className="curation-card-content"
                      >
                        {visibleHeaders.map((header) => {
                          if (header === "Status" || header === "Titulo") return null;
                          const content =
                            article[header] !== undefined
                              ? String(article[header])
                              : "N/A";

                          return (
                            <Box key={header} sx={{ mb: 1.5 }} className="curation-card-field">
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontWeight: "bold", display: "block" }}
                                className="curation-card-field-label"
                              >
                                {header}:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                }}
                                className="curation-card-field-value"
                              >
                                {content}
                              </Typography>
                            </Box>
                          );
                        })}
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "space-between", pt: 0 }}
                        className="curation-card-actions"
                      >
                        <Box>
                          <Tooltip title="Excluir este artigo">
                            <Button
                              size="small"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleSingleDelete(article)}
                            >
                              Excluir
                            </Button>
                          </Tooltip>
                          <Tooltip title="Visualizar PDF do documento">
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                handlePreviewPdf(article["URL DO DOCUMENTO"])
                              }
                              disabled={!article["URL DO DOCUMENTO"]}
                              sx={{ ml: 1 }}
                            >
                              Visualizar
                            </Button>
                          </Tooltip>
                        </Box>
                        <Box>
                          {statusInfo.status === "approved_ai" && (
                            <Tooltip title="Aprovar manualmente este artigo">
                              <Button
                                size="small"
                                color="primary"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleManualApproval(article)}
                              >
                                Aprovar Manualmente
                              </Button>
                            </Tooltip>
                          )}
                          <Tooltip title={statusInfo.status === "approved" || statusInfo.status === "rejected" ? "Re-analisar com IA" : "Analisar com IA"}>
                            <Button
                              size="small"
                              startIcon={
                                isProcessingThisRow ? (
                                  <CircularProgress size={20} />
                                ) : statusInfo.status === "approved" ||
                                  statusInfo.status === "rejected" ? (
                                  <RefreshIcon />
                                ) : (
                                  <ScienceIcon />
                                )
                              }
                              onClick={() => handleSingleCuration(article)}
                              disabled={
                                statusInfo.status === "unavailable" ||
                                isTriggering ||
                                processingRow
                              }
                            >
                              {isProcessingThisRow
                                ? "Analisando..."
                                : statusInfo.status === "approved" ||
                                    statusInfo.status === "rejected"
                                  ? "Re-analisar"
                                  : "Analisar"}
                            </Button>
                          </Tooltip>
                          <Tooltip title="Categorizar com IA">
                            <Button
                              size="small"
                              startIcon={<CategoryIcon />}
                              onClick={() => handleSingleCategorize(article)}
                              disabled={
                                statusInfo.status === "unavailable" ||
                                isTriggering ||
                                processingRow
                              }
                            >
                              Categorizar
                            </Button>
                          </Tooltip>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            <TablePagination
              rowsPerPageOptions={[9, 18, 30, 48]}
              component="div"
              count={filteredArticles.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Itens por página:"
              sx={{ mt: 2, mr: 2, display: "flex", justifyContent: "flex-end" }}
              className="curation-pagination"
            />
          </Box>
        )}
      </Container>

      {/* Dialog de Resultado da Análise */}
      <Dialog
        open={openAnalysisDialog}
        onClose={handleCloseAnalysisDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        {analysisResult && (
          <>
            <DialogTitle
              sx={{
                bgcolor: getStatusInfo(analysisResult).color + ".light",
                color: getStatusInfo(analysisResult).color + ".contrastText",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              {getStatusInfo(analysisResult).icon}
              <Box>
                <Typography variant="h6">Análise Concluída</Typography>
                <Typography variant="subtitle2">
                  Status: {getStatusInfo(analysisResult).label.toUpperCase()}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                {analysisResult["Titulo"] || "Sem Título"}
              </Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Dados Extraídos:
                </Typography>
                <List dense>
                  {visibleHeaders.map((header) => {
                    if (header === "Status" || header === "Titulo") return null;
                    const value = analysisResult[header];
                    if (!value) return null; // Não mostra campos vazios na evidencia

                    return (
                      <ListItem key={header} disablePadding sx={{ py: 1 }}>
                        <ListItemText
                          primary={header}
                          secondary={value}
                          primaryTypographyProps={{
                            fontWeight: "bold",
                            color: "primary",
                          }}
                          secondaryTypographyProps={{
                            variant: "body1",
                            color: "text.primary",
                            style: { whiteSpace: "pre-wrap" },
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={handleCloseAnalysisDialog}
                variant="contained"
                color="primary"
                size="large"
                endIcon={<CheckCircleIcon />}
              >
                Continuar Curadoria
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Modal de Preview do PDF */}
      <Modal
        open={openPreview}
        onClose={handleClosePreview}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "90%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography id="preview-modal-title" variant="h6" component="h2">
              Visualização do Documento
            </Typography>
            <IconButton onClick={handleClosePreview}>
              <ClearIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, bgcolor: "#f5f5f5" }}>
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            ) : (
              <Typography variant="body1" sx={{ p: 4 }}>
                URL inválida ou documento não encontrado.
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CurationPage;
