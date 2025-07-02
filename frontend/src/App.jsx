import React, { useEffect, useState } from "react";
import "./index.css";

const API_URL = "https://staff-manager-2z99.onrender.com";

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getAllEmployees();
  }, []);

  const getAllEmployees = async () => {
    try {
      const res = await fetch(`${API_URL}/allemployees`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `${API_URL}/update/${editingId}`
      : `${API_URL}/add-emp`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setForm({ name: "", email: "", phone: "", city: "" });
      setEditingId(null);
      getAllEmployees();
    } catch (err) {
      console.error("Error saving employee");
    }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      city: emp.city,
    });
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this employee?")) {
      try {
        await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
        getAllEmployees();
      } catch (err) {
        console.error("Error deleting employee");
      }
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Employee Manager</h2>

      <form onSubmit={handleSubmit} className="form">
        {["name", "email", "phone", "city"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={handleChange}
            required={field === "name" || field === "email"}
            className="input"
          />
        ))}

        <div className="button-group">
          <button type="submit" className="btn primary">
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", email: "", phone: "", city: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.city}</td>
              <td>
                <button className="btn edit" onClick={() => handleEdit(emp)}>
                  Edit
                </button>
                <button
                  className="btn delete"
                  onClick={() => handleDelete(emp._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
