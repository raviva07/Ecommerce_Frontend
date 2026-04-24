// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(form);

      if (!res.success) {
        setError(res.message);
        return;
      }

      // ROLE BASED REDIRECT
      const role = res.data?.role;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4 fw-bold">Login</h3>

        {error && (
          <div className="alert alert-danger py-2 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <div className="text-center mt-3">
          <small>
            Don’t have an account?{" "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
