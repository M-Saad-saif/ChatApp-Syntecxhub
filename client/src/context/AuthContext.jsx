import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { connectSocket, disconnectSocket } from "../utils/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then(({ data }) => {
          setUser(data.user);
          connectSocket(token);
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    connectSocket(data.token);
    return data.user;
  };

  const signup = async (username, email, password) => {
    const { data } = await api.post("/auth/signup", {
      username,
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    connectSocket(data.token);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    disconnectSocket();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
