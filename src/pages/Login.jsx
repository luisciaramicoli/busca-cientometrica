import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  IconButton,     // Added
  InputAdornment, // Added
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Added
import { useAuth } from "../hooks/useAuth";
import "./Login.css";
import { login } from "../api";

function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [username, setUsername] = useState("admin"); // Pré-popula para facilitar o teste
  const [password, setPassword] = useState("password123"); // Pré-popula para facilitar o teste
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { accessToken } = await login(username, password);

      auth.login(accessToken);

      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Falha no login. Verifique suas credenciais.";
      setError(errorMessage);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show); // Added
  const handleMouseDownPassword = (event) => { event.preventDefault(); }; // Added

  return (
    <Box className="login-container">
      <Paper elevation={3} className="login-paper">
        <Box className="login-box">
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'} // Changed type dynamically
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{ // Added InputProps for the icon
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default LoginPage;
