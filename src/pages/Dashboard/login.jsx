import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import axiosInstance from "../../utils/axiosInstance";
import { setToken } from "../../utils/auth";

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password is required");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      setToken(response.data.token);
      nav("/admin/dashboard");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-box">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
