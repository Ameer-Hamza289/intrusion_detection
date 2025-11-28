import { createContext } from 'react';


interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void> | Promise<{error: string}>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

