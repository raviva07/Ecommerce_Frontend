import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUser({
          name: res.data.data.name,
          email: res.data.data.email
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:8080/api/users/profile",
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setMessage("Profile updated successfully ✅");
        fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">My Profile</h2>

          {loading && <div className="text-center mb-3"><div className="spinner-border text-primary" /></div>}
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={updateProfile}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={user.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
