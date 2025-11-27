import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    // For demo purposes, bypass authentication
    // In production, implement actual API call here:
    // const response = await api.post('/auth/login', { username, password });
    // localStorage.setItem('token', response.data.token);
    localStorage.setItem('token', 'demo-token');
    setIsAuthenticated(true);
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