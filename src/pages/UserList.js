import React, { useState } from "react";

// Composant User (individuel)
const User = ({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card" style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
      <h3>{user.name}</h3>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Âge:</strong> {user.age}
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        {/* Bouton pour modifier */}
        <button onClick={() => onEdit(user)} style={{ backgroundColor: "#f0ad4e", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "3px" }}>
          Modifier
        </button>
        {/* Bouton pour supprimer */}
        <button onClick={() => onDelete(user.id)} style={{ backgroundColor: "#d9534f", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "3px" }}>
          Supprimer
        </button>
      </div>
    </div>
  );
};

// Composant UserList (liste des utilisateurs)
const UserList = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john.doe@example.com", age: 30 },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", age: 25 },
  ]);

  const [form, setForm] = useState({ id: null, name: "", email: "", age: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Soumission du formulaire (ajouter ou modifier)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Modifier un utilisateur existant
      setUsers(
        users.map((user) =>
          user.id === form.id ? { ...user, ...form } : user
        )
      );
    } else {
      // Ajouter un nouvel utilisateur
      setUsers([
        ...users,
        { id: users.length + 1, ...form },
      ]);
    }
    setForm({ id: null, name: "", email: "", age: "" });
    setIsEditing(false);
  };

  // Modifier un utilisateur
  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  // Supprimer un utilisateur
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Gestion des utilisateurs</h1>

      {/* Formulaire pour ajouter/modifier */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <input
          name="age"
          type="number"
          placeholder="Âge"
          value={form.age}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#5cb85c", color: "#fff", border: "none", borderRadius: "5px" }}>
          {isEditing ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Liste des utilisateurs */}
      {users.map((user) => (
        <User key={user.id} user={user} onEdit={handleEdit} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default UserList;
