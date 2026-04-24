import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await register(form);

      if (!res.success) {
        setError(res.message || "Registration failed");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);

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
          <h3 className="text-center mb-4 fw-bold">Create Account</h3>

          {/* ALERTS */}
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control form-control-lg"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

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
                minLength={6}
              />
            </div>

            {/* ROLE */}
            <div className="mb-3">
              <select
                name="role"
                className="form-select form-select-lg"
                value={form.role}
                onChange={handleChange}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ADMIN">Admin</option>
              </select>
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
                  Creating...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="text-center mt-3">
            <small>
              Already have an account?{" "}
              <span
                style={{ cursor: "pointer", color: "#0d6efd" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
