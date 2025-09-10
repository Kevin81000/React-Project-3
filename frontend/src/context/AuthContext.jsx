import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await axios.post("const res = await axios.post('https://personal-notes-backend.onrender.com/api/auth/login', { email, password });", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser({ id: res.data.token });
    navigate("/notes");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
