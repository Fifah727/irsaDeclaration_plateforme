import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert,Row,Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import styled from "styled-components";

// Styles pour le conteneur principal
const RegisterContainer = styled.div`
  background-color: #1a202c;
  color: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Arial", sans-serif;
  padding: 50px;
`;

// Style pour la carte de formulaire
const RegisterFormCard = styled(Card)`
  width: 100%;
  max-width: 800px; /* Ajustez la largeur maximale si nécessaire */
  background-color: white;
  padding: 5rem;
`;

// Style pour le titre
const RegisterTitle = styled.h3`
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
  &:focus {
    border-color: #4cbaceff; /* Nouvelle couleur au focus */
    box-shadow: 0 0 0 0.2rem rgba(76, 186, 206, 0.25);
  }
`;

// Style pour le select de formulaire
const FormSelect = styled(Form.Select)`
  border-radius: 10px;
  border-color: #ced4da;
  padding: 0.75rem;
  &:focus {
    border-color: #4cbaceff; /* Nouvelle couleur au focus */
    box-shadow: 0 0 0 0.2rem rgba(76, 186, 206, 0.25);
  }
`;

// Style pour le bouton d'inscription
const RegisterButton = styled(Button)`
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

// Style pour le lien "Se connecter ici"
const LoginLink = styled(Link)`
  text-decoration: none;
  color: #4cbaceff; /* Nouvelle couleur pour le lien */
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

// Style pour le texte "Vous avez déjà un compte ?"
const AlreadyAccountText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #1a202c; /* Bleu foncé pour le texte */
`;

function Register() {
  const [directions, setDirections] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idDir: "",
    nom: "",
    prenom: "",
    cin: "",
    nif: "",
    fonction: "",
    mdp: "",
    email: ""
  });

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/directions');
        setDirections(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des directions :", error);
        setError("Impossible de charger les directions.");
      }
    };

    fetchDirections();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cin") {
      if (!/^\d*$/.test(value)) {
        setError("Le CIN ne doit contenir que des chiffres.");
        return;
      }
      if (value.length > 12) {
        setError("Le CIN doit contenir exactement 12 chiffres.");
        return;
      }
      if (value.length === 4 && value[3] !== "1" && value[3] !== "0") {
        setError("Le 4ème chiffre du CIN doit être 1 ou 0.");
        return;
      }
    }

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

    const { idDir, nom, prenom, cin, nif, fonction, mdp, email } = formData;

    if (!idDir || !nom || !prenom || !cin || !nif || !fonction || !mdp || !email) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (cin.length !== 12) {
      setError("Le CIN doit contenir exactement 12 chiffres.");
      return;
    }

    if (cin[3] !== "1" && cin[3] !== "0") {
      setError("Le 4ème chiffre du CIN doit être 1 ou 0.");
      return;
    }

    if (nif.length !== 10) {
      setError("Le NIF doit contenir exactement 10 chiffres.");
      return;
    }

    setError("");

    try {
      await axios.post('http://localhost:5000/register', formData);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      console.log("Inscription réussie");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
      }
    }
  };

  return (
    <RegisterContainer>
      <RegisterFormCard className="p-4">
        <RegisterTitle>Inscription</RegisterTitle>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="idDir">
            <FormLabel>Direction</FormLabel>
            <FormSelect
              name="idDir"
              value={formData.idDir}
              onChange={handleChange}
              required
            >
              <option value="">Choisissez une Direction</option>
              {directions.map((direction) => (
                <option key={direction.idDir} value={direction.idDir}>
                  {direction.nomDir} - {direction.regionDir}
                </option>
              ))}
            </FormSelect>
          </Form.Group>

          <Form.Group className="mb-3" controlId="fonction">
            <FormLabel>Fonction</FormLabel>
            <FormInput
              type="text"
              name="fonction"
              value={formData.fonction}
              onChange={handleChange}
              placeholder="Entrez la fonction"
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nom">
                <FormLabel>Nom</FormLabel>
                <FormInput
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Entrez le nom"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="prenom">
                <FormLabel>Prénom</FormLabel>
                <FormInput
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Entrez le prénom"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="cin">
                <FormLabel>CIN</FormLabel>
                <FormInput
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  placeholder="Entrez le CIN (12 chiffres)"
                  required
                  maxLength="12"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="email">
                <FormLabel>Email</FormLabel>
                <FormInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Entrez l'adresse email"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nif">
                <FormLabel>NIF</FormLabel>
                <FormInput
                  type="text"
                  name="nif"
                  value={formData.nif}
                  onChange={handleChange}
                  placeholder="Entrez le NIF (10 chiffres)"
                  required
                  maxLength="10"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="mdp">
                <FormLabel>Mot de Passe</FormLabel>
                <FormInput
                  type="password"
                  name="mdp"
                  value={formData.mdp}
                  onChange={handleChange}
                  placeholder="Entrez le mot de passe"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="d-grid">
            <RegisterButton type="submit">S'inscrire</RegisterButton>
          </div>
        </Form>

        <AlreadyAccountText>
          Vous avez déjà un compte ? <LoginLink to="/login">Connectez-vous ici</LoginLink>.
        </AlreadyAccountText>
      </RegisterFormCard>
    </RegisterContainer>
  );
}

export default Register;