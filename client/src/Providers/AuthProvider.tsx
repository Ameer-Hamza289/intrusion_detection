import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    if (username === "amirkhan1122" && password === "Admin@123") {
      localStorage.setItem('token', 'demo-token');
      setIsAuthenticated(true);
      return { success: true };
    }
    throw new Error("Invalid credentials");
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
  );}
