import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [userToken, setUserToken] = useState(localStorage.getItem('accessToken'));
    const [userRole, setUserRole] = useState(null); // Add state for user role

    useEffect(() => {
        if (userToken) {
            localStorage.setItem('accessToken', userToken);
            // Decode token and set user role
            try {
                const decodedToken = jwtDecode(userToken);
                setUserRole(decodedToken.role);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setUserToken(null); // Clear invalid token
                setUserRole(null);
            }
            axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        } else {
            localStorage.removeItem('accessToken');
            delete axios.defaults.headers.common['Authorization'];
            setUserRole(null); // Clear role on logout
        }
    }, [userToken]);

    const login = (token) => {
        setUserToken(token);
    };

    const logout = () => {
        setUserToken(null);
    };

    const authValue = {
        isAuthenticated: !!userToken,
        token: userToken,
        userRole, // Expose userRole
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}
