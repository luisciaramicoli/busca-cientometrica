import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import CurationPage from './pages/Curation';
import ManualInsertPage from './pages/ManualInsert';
import UserRegistrationPage from './pages/UserRegistration'; // Import UserRegistrationPage
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  return (
    <Routes>
      {/* Rota pública de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/curation" element={<CurationPage />} />
        <Route path="/manual-insert" element={<ManualInsertPage />} />
        <Route path="/register-user" element={<UserRegistrationPage />} /> {/* New User Registration Route */}
      </Route>
      
      {/* Redirecionamento padrão */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;