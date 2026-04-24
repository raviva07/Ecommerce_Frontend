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
    role: "CUSTOMER", // ✅ default role
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

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await register(form);

      if (!res.success) {
        setError(res.message);
        return;
      }

      setSuccess("Registration successful!");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow border-0">
        <div className="card-body p-4">

          <h3 className="text-center fw-bold mb-4">
            Create Account
          </h3>

          {/* ALERTS */}
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          {success && (
            <div className="alert alert-success">{success}</div>
          )}

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

            {/* ROLE SELECTION */}
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* LOGIN LINK */}
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
