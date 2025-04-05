import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importez les icônes d'œil

// Styles pour le conteneur principal
const LoginContainer = styled.div`
  background-color: #1a202c;
  color: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Arial", sans-serif;
  padding: 20px;
`;

// Style pour la carte de formulaire
const LoginFormCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding: 2rem;
`;

// Style pour le titre
const LoginTitle = styled.h3`
  text-align: center;
  margin-bottom: 2rem;
  font-weight: bold;
  color: #1a202c; /* Bleu foncé pour le titre */
`;

// Style pour les labels de formulaire
const FormLabel = styled(Form.Label)`
  font-weight: bold;
  color: #1a202c;
`;

// Style pour les inputs de formulaire
const FormInput = styled(Form.Control)`
  border-radius: 10px;
  border-color: #ced4da;
  padding: 0.75rem;
  padding-right: 40px; /* Espace pour l'icône */
  &:focus {
    border-color: #4cbaceff; /* Nouvelle couleur au focus */
    box-shadow: 0 0 0 0.2rem rgba(76, 186, 206, 0.25);
  }
`;

// Style pour le conteneur de l'icône
const PasswordToggleContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #4cbaceff; /* Nouvelle couleur pour l'icône */
`;

// Style pour le bouton de connexion
const LoginButton = styled(Button)`
  background-color: #1a202c;
  border-color: #1a202c;
  border-radius: 10px;
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  color: white;
  &:hover {
    background-color: #2d3748;
    border-color: #2d3748;
  }
`;

// Style pour le lien "S'inscrire"
const RegisterLink = styled(Link)`
  text-decoration: none;
  color: #4cbaceff; /* Nouvelle couleur pour le lien */
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

// Style pour le texte "Vous n'avez pas de compte ?"
const NoAccountText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #1a202c; /* Bleu foncé pour le texte */
`;

function Login() {
  const [formData, setFormData] = useState({
    nif: "",
    mdp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nif") {
      if (!/^\d*$/.test(value)) {
        setError("Le NIF ne doit contenir que des chiffres.");
        return;
      }
      if (value.length > 10) {
        setError("Le NIF doit contenir exactement 10 chiffres.");
        return;
      }
    }

    setError("");
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nif || !formData.mdp) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    if (formData.nif.length !== 10) {
      setError("Le NIF doit contenir exactement 10 chiffres.");
      return;
    }

    setError("");

    try {
      const response = await axios.post("http://localhost:5000/login", formData);
      localStorage.setItem("userId", response.data.user.idu);
      localStorage.setItem("emailId", response.data.user.email);

      if (localStorage.getItem("userId")) {
        window.location.href = "/";
      }

      setError("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
      }
    }
  };

  return (
    <LoginContainer>
      <LoginFormCard className="p-4">
        <LoginTitle>Bienvenue</LoginTitle>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nif" className="mb-3">
            <FormLabel>NIF</FormLabel>
            <FormInput
              type="text"
              name="nif"
              value={formData.nif}
              onChange={handleChange}
              placeholder="Entrez votre NIF (10 chiffres)"
              maxLength="10"
              required
            />
          </Form.Group>

          <Form.Group controlId="mdp" className="mb-3">
            <FormLabel>Mot de passe</FormLabel>
            <div style={{ position: "relative" }}>
              <FormInput
                type={showPassword ? "text" : "password"}
                name="mdp"
                value={formData.mdp}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                required
              />
              <PasswordToggleContainer onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggleContainer>
            </div>
          </Form.Group>

          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <div className="d-grid">
            <LoginButton type="submit">Connexion</LoginButton>
          </div>
        </Form>

        <NoAccountText>
          Vous n'avez pas de compte ?{" "}
          <RegisterLink to="/register">S'inscrire</RegisterLink>.
        </NoAccountText>
      </LoginFormCard>
    </LoginContainer>
  );
}

export default Login;