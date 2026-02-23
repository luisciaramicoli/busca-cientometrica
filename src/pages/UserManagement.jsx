import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, updateUserPermissions, deleteUser } from '../api';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, 
  Dialog, DialogTitle, DialogContent, DialogActions, Chip,
  FormGroup, FormControlLabel, Checkbox, FormLabel, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../components/Header';

const CATEGORIES_OPTIONS = [
  "MANEJO ECOFISIOLÓGICO E NUTRICIONAL DA CITRICULTURA DE ALTA PERFORMANCE",
  "MANEJO DE NUTRIENTES E AGUA",
  "BIOINSUMOS"
];

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      alert('Erro ao carregar lista de usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id, username) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${username}"? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteUser(id);
        alert('Usuário excluído com sucesso!');
        fetchUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        alert('Falha ao excluir usuário.');
      }
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    
    // Parse categories from DB
    let cats = [];
    if (user.allowed_categories) {
      if (typeof user.allowed_categories === 'string' && user.allowed_categories.startsWith('[')) {
        try {
          cats = JSON.parse(user.allowed_categories);
        } catch (e) {
          cats = user.allowed_categories.split(',').map(c => c.trim());
        }
      } else if (Array.isArray(user.allowed_categories)) {
        cats = user.allowed_categories;
      } else if (typeof user.allowed_categories === 'string') {
        cats = user.allowed_categories.split(',').map(c => c.trim());
      }
    }
    setSelectedCategories(cats);
    setOpenModal(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleSave = async () => {
    try {
      await updateUserPermissions(selectedUser.id, newRole, selectedCategories);
      
      alert('Permissões atualizadas com sucesso!');
      setOpenModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar permissões:', error);
      alert('Falha ao atualizar permissões.');
    }
  };

  if (loading) return <Typography sx={{ p: 3 }}>Carregando usuários...</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Header />
      <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto', mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} color="primary" title="Voltar">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Gerenciamento de Usuários</Typography>
        </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Categorias Permitidas</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Chip label={user.role} color={user.role === 'admin' ? 'primary' : 'default'} /></TableCell>
                <TableCell>
                  {user.allowed_categories && (user.allowed_categories.length > 0 && user.allowed_categories !== '[]') ? (
                    typeof user.allowed_categories === 'string' && user.allowed_categories.startsWith('[') 
                    ? JSON.parse(user.allowed_categories).join(', ') 
                    : (Array.isArray(user.allowed_categories) ? user.allowed_categories.join(', ') : user.allowed_categories)
                  ) : 'Todas (Global)'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => handleEdit(user)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(user.id, user.username)} title="Excluir">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Permissões: {selectedUser?.username}</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={newRole} label="Role" onChange={(e) => setNewRole(e.target.value)}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="cientometria">Cientometria</MenuItem>
              <MenuItem value="curadoria_boaretto">Curadoria Boaretto</MenuItem>
              <MenuItem value="curadoria_bonetti">Curadoria Bonetti</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Categorias Permitidas</FormLabel>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
              Se nenhuma for selecionada, o usuário terá acesso a todas (Global).
            </Typography>
            <FormGroup>
              {CATEGORIES_OPTIONS.map((cat) => (
                <FormControlLabel
                  key={cat}
                  control={
                    <Checkbox 
                      checked={selectedCategories.includes(cat)} 
                      onChange={() => handleCategoryChange(cat)} 
                    />
                  }
                  label={cat}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Salvar Alterações</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
  );
};

export default UserManagement;
