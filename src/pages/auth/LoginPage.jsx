// src/pages/auth/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(form);

      if (!res.success) {
        setError(res.message || "Login failed");
        return;
      }

      // Redirect based on role
      if (res.data?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow-lg border-0" style={{ maxWidth: "420px", width: "100%" }}>
        
        <div className="card-body p-4">
          <h3 className="text-center mb-4 fw-bold">Login</h3>

          {/* ERROR */}
          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="Email Address"
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
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-3">
            <small>
              Don’t have an account?{" "}
              <span
                style={{ cursor: "pointer", color: "#0d6efd" }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
