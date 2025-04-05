import React, { useState } from "react";
import axios from "axios";

const SendEmailForm = () => {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    text: "",
  });

  const [message, setMessage] = useState("");

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/send-email", formData);
      setMessage("Email envoyé avec succès !"+response);
      setFormData({ to: "", subject: "", text: "" }); // Réinitialise le formulaire
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      setMessage("Erreur lors de l'envoi de l'email.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
      <h1>Envoyer un Email</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Destinataire :</label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
            style={{ display: "block", margin: "10px auto", width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Sujet :</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{ display: "block", margin: "10px auto", width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Message :</label>
          <textarea
            name="text"
            rows="5"
            value={formData.text}
            onChange={handleChange}
            required
            style={{ display: "block", margin: "10px auto", width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#5cb85c",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Envoyer
        </button>
      </form>
      {message && <p style={{ marginTop: "20px", color: "green" }}>{message}</p>}
    </div>
  );
};

export default SendEmailForm;
