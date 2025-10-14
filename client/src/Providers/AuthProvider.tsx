import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    // try {
      const response = await apiLogin(username, password);
      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);
    // } catch (error) {
    //   throw error;
    // }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}