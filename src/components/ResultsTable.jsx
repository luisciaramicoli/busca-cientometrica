import { useState, useMemo } from 'react';
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Link,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

const headCells = [
  { id: 'title', label: 'Título' },
  { id: 'authors', label: 'Autores' },
  { id: 'year', label: 'Ano' },
  { id: 'source', label: 'Fonte' },
  { id: 'doi', label: 'DOI' },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all results' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const ResultsTable = ({ results, onSave, loading }) => {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('year');
  const [filterText, setFilterText] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = results.map((n, i) => n.id ?? `row-${i}`);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1));
    else if (selectedIndex > 0) newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSave = () => {
    const selectedData = results.filter((row, i) => selected.includes(row.id ?? `row-${i}`));
    onSave(selectedData);
  };

  const generateBibTeX = (data) => {
    return data.map((row, index) => {
        const id = row.doi ? row.doi.split('/').pop() : `article_${index}`;
        const authors = Array.isArray(row.authors) ? row.authors.join(' and ') : row.authors;
        
        return `@article{${id},
  title = {${row.title}},
  author = {${authors}},
  journal = {${row.source || 'Unknown'}},
  year = {${row.year}},
  doi = {${row.doi || ''}},
  url = {${row.pdf_url || ''}}
}`;
    }).join('\n\n');
  };

  const handleExportBibTeX = () => {
      const selectedData = results.filter((row, i) => selected.includes(row.id ?? `row-${i}`));
      const bibtexContent = generateBibTeX(selectedData);
      
      const blob = new Blob([bibtexContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export_cientometria.bib');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const filteredResults = useMemo(() => {
    if (!filterText) return results;
    const lowerFilter = filterText.toLowerCase();
    return results.filter((row) => {
      const title = row.title ? row.title.toLowerCase() : '';
      const authors = Array.isArray(row.authors) ? row.authors.join(' ').toLowerCase() : (row.authors ? row.authors.toLowerCase() : '');
      return title.includes(lowerFilter) || authors.includes(lowerFilter);
    });
  }, [results, filterText]);

  const sortedResults = useMemo(() => {
    const comparator = (a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle null/undefined
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Handle arrays (authors)
      if (Array.isArray(aValue)) aValue = aValue.join(', ');
      if (Array.isArray(bValue)) bValue = bValue.join(', ');

      // String comparison for text, numeric for numbers if possible
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (bValue < aValue) return order === 'asc' ? 1 : -1;
      if (bValue > aValue) return order === 'asc' ? -1 : 1;
      return 0;
    };
    return [...filteredResults].sort(comparator);
  }, [filteredResults, order, orderBy]);

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, border: 1, borderColor: 'divider', borderRadius: 2, mb: 4 }} elevation={0}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Resultados da Busca
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} lg={6}>
             <TextField
              label="Filtrar por Título ou Autor"
              variant="outlined"
              size="small"
              fullWidth
              placeholder="Ex: 'Smith' ou 'Climate Change'..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="select-orderby-label">Ordenar por</InputLabel>
              <Select
                labelId="select-orderby-label"
                value={orderBy}
                label="Ordenar por"
                onChange={(e) => setOrderBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {headCells.map((cell) => (
                  <MenuItem key={cell.id} value={cell.id}>
                    {cell.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
             <FormControl fullWidth size="small" variant="outlined">
              <InputLabel id="select-order-label">Ordem</InputLabel>
              <Select
                labelId="select-order-label"
                value={order}
                label="Ordem"
                onChange={(e) => setOrder(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="asc">Crescente</MenuItem>
                <MenuItem value="desc">Decrescente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        justifyContent="flex-end" 
        sx={{ mb: 3 }}
      >
        <Button
            variant="outlined"
            onClick={handleExportBibTeX}
            disabled={selected.length === 0}
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: 2 }}
        >
            Exportar BibTeX
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={selected.length === 0}
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2 }}
        >
          Salvar no Google Sheets ({selected.length})
        </Button>
      </Stack>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={filteredResults.length}
          />
          <TableBody>
            {sortedResults.map((row, index) => {
              const uniqueId = row.id ?? `row-${index}`;
              const isItemSelected = isSelected(uniqueId);
              const authorsText = Array.isArray(row.authors) ? row.authors.join(', ') : row.authors;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, uniqueId)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={uniqueId}
                  selected={isItemSelected}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={isItemSelected} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Link href={row.id} target="_blank" rel="noopener" underline="hover" color="inherit">
                      {row.title || '—'}
                    </Link>
                  </TableCell>
                  <TableCell>{authorsText || '—'}</TableCell>
                  <TableCell>{row.year || '—'}</TableCell>
                  <TableCell>{row.source || '—'}</TableCell>
                  <TableCell>
                    {row.doi ? (
                      <Link href={`https://doi.org/${row.doi}`} target="_blank" rel="noopener" underline="hover">
                        {row.doi}
                      </Link>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};


export default ResultsTable;
