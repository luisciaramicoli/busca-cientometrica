import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const SearchForm = ({ onSearch, loading }) => {
  const [searchTerms, setSearchTerms] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [sortOption, setSortOption] = useState('relevance');
  const [searchHistory, setSearchHistory] = useState(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const saveToHistory = (params) => {
    const newHistory = [params, ...searchHistory.filter(h => h.search_terms !== params.search_terms)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      search_terms: searchTerms,
      start_year: startYear,
      end_year: endYear,
      sort_option: sortOption,
    };
    onSearch(params);
    saveToHistory(params);
  };

  const handleDateShortcut = (years) => {
    const currentYear = new Date().getFullYear();
    setEndYear(currentYear);
    setStartYear(currentYear - years);
  };

  const restoreHistory = (historyItem) => {
    setSearchTerms(historyItem.search_terms);
    setStartYear(historyItem.start_year);
    setEndYear(historyItem.end_year);
    setSortOption(historyItem.sort_option || 'relevance');
  };

  return (
    <Box>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2, md: 3 },
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          mb: 3
        }}
        elevation={0}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchIcon /> Parâmetros de Busca
        </Typography>
        
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12}>
            <TextField
              label="Termos de Busca (OpenAlex)"
              placeholder="Ex: 'climate change' AND ('adaptation' OR 'mitigation')"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              required
              helperText="Use operadores booleanos para refinar sua pesquisa."
            />
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <TextField
              label="Ano de Início"
              variant="outlined"
              type="number"
              fullWidth
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Ano de Fim"
              variant="outlined"
              type="number"
              fullWidth
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
             <FormControl fullWidth>
                <InputLabel>Ordenação</InputLabel>
                <Select
                  value={sortOption}
                  label="Ordenação"
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <MenuItem value="relevance">Relevância</MenuItem>
                  <MenuItem value="newest">Mais Recentes</MenuItem>
                  <MenuItem value="cited">Mais Citados</MenuItem>
                </Select>
             </FormControl>
          </Grid>

          <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              loading={loading}
              loadingPosition="start"
              startIcon={<SearchIcon />}
              sx={{ height: '56px' }}
            >
              BUSCAR
            </Button>
          </Grid>

          <Grid item xs={12}>
             <Typography variant="caption" sx={{ mr: 1, fontWeight: 'bold' }}>Atalhos de Data:</Typography>
             <Chip label="Últimos 5 Anos" size="small" onClick={() => handleDateShortcut(5)} sx={{ mr: 1, cursor: 'pointer' }} />
             <Chip label="Últimos 10 Anos" size="small" onClick={() => handleDateShortcut(10)} sx={{ mr: 1, cursor: 'pointer' }} />
             <Chip label="Últimos 20 Anos" size="small" onClick={() => handleDateShortcut(20)} sx={{ cursor: 'pointer' }} />
          </Grid>
        </Grid>
      </Paper>

      {/* Accordion de Dicas */}
      <Accordion sx={{ mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', color: 'primary.main' }}>
            <LightbulbIcon fontSize="small" />
            Dicas de Pesquisa e Exemplos (Prompts)
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: '#f9f9f9' }}>
          <Grid container spacing={2}>
             <Grid item xs={12} md={6}>
                 <Typography variant="subtitle2" gutterBottom fontWeight="bold">Operadores Booleanos:</Typography>
                 <Typography variant="body2" paragraph>
                    • <b>AND</b>: Retorna resultados contendo AMBOS os termos.<br/>
                    <i>Ex: "machine learning" AND "cancer"</i>
                 </Typography>
                 <Typography variant="body2" paragraph>
                    • <b>OR</b>: Retorna resultados contendo PELO MENOS UM dos termos.<br/>
                    <i>Ex: "neoplasm" OR "tumor" OR "cancer"</i>
                 </Typography>
                 <Typography variant="body2" paragraph>
                    • <b>NOT</b>: Exclui resultados contendo o termo.<br/>
                    <i>Ex: "virus" NOT "computer"</i>
                 </Typography>
             </Grid>
             <Grid item xs={12} md={6}>
                 <Typography variant="subtitle2" gutterBottom fontWeight="bold">Exemplos Avançados:</Typography>
                 <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#fff', p: 1, border: '1px solid #ddd', borderRadius: 1, mb: 1 }}>
                    ("climate change" OR "global warming") AND ("adaptation" OR "mitigation")
                 </Typography>
                 <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                    Busca ampla sobre mudanças climáticas e estratégias de resposta.
                 </Typography>

                 <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#fff', p: 1, border: '1px solid #ddd', borderRadius: 1, mb: 1 }}>
                    "artificial intelligence" AND "education" AND year:2023
                 </Typography>
                 <Typography variant="caption" display="block">
                    Foca especificamente em AI na educação publicada em 2023.
                 </Typography>
             </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Histórico de Busca */}
      {searchHistory.length > 0 && (
          <Paper sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }} elevation={0}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon fontSize="small" color="action" />
                  Histórico Recente
              </Typography>
              <List dense>
                  {searchHistory.map((item, index) => (
                      <div key={index}>
                          <ListItem button onClick={() => restoreHistory(item)}>
                              <ListItemIcon>
                                  <SearchIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                  primary={item.search_terms} 
                                  secondary={`${item.start_year} - ${item.end_year} • ${item.sort_option === 'relevance' ? 'Relevância' : item.sort_option === 'newest' ? 'Mais Recentes' : 'Mais Citados'}`} 
                              />
                          </ListItem>
                          {index < searchHistory.length - 1 && <Divider />}
                      </div>
                  ))}
              </List>
          </Paper>
      )}
    </Box>
  );
};

export default SearchForm;
