import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; 


interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const decodedToken: any = jwtDecode(storedToken); 
        if (decodedToken.exp * 1000 > Date.now()) {
          
          setIsAuthenticated(true);
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
