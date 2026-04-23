import React, { useEffect, useState } from "react";
import userService from "../../services/userService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "CUSTOMER",
  });

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users", err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete user?")) return;
    try {
      await userService.deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  // 🔥 Start edit
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role, // ✅ include role
    });
  };

  // 🔥 Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Update user
  const handleUpdate = async (id) => {
    try {
      await userService.updateUser(id, form); // now includes role
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>

              {/* NAME */}
              <td>
                {editingUser === u.id ? (
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  u.name
                )}
              </td>

              {/* EMAIL */}
              <td>
                {editingUser === u.id ? (
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                ) : (
                  u.email
                )}
              </td>

              {/* 🔥 ROLE (NEW FEATURE) */}
              <td>
                {editingUser === u.id ? (
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                ) : (
                  <span
                    className={`badge ${
                      u.role === "ADMIN" ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {u.role}
                  </span>
                )}
              </td>

              {/* ACTION */}
              <td>
                {editingUser === u.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleUpdate(u.id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
