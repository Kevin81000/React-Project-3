import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Notes from "./components/Notes";
import Categories from "./components/Categories";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
