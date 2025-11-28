import { createContext } from 'react';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

