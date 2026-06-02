import { createContext, useContext, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("travel_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("travel_token"));

  async function login(payload) {
    const data = await authService.login(payload);
    localStorage.setItem("travel_token", data.token);
    localStorage.setItem("travel_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function signup(payload) {
    const data = await authService.signup(payload);
    localStorage.setItem("travel_token", data.token);
    localStorage.setItem("travel_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("travel_token");
    localStorage.removeItem("travel_user");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, token, login, signup, logout, isAuthed: Boolean(token) }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
