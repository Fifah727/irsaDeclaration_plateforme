import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function Profil() {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        nif: "",
    }); // État pour stocker les données utilisateur
    const [error, setError] = useState(""); // Message d'erreur
    const [success, setSuccess] = useState(""); // Message de succès

    const userId = localStorage.getItem("userId"); // Récupérer l'ID utilisateur depuis localStorage

    // Charger les données utilisateur au chargement du composant
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${userId}`);
                setFormData(response.data); // Remplir les données du formulaire
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur :", error);
                setError("Impossible de charger les informations utilisateur.");
            }
        };

        if (userId) {
            fetchUserData();
        } else {
            setError("Utilisateur non connecté.");
        }
    }, [userId]);

    // Fonction pour gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/users/${userId}`, formData); // Envoyer les modifications
            setSuccess("Les informations ont été mises à jour avec succès.");
            setError(""); // Réinitialiser les erreurs
        } catch (error) {
            console.error("Erreur lors de la mise à jour des informations utilisateur :", error);
            setError("Une erreur est survenue lors de la mise à jour.");
            setSuccess(""); // Réinitialiser le succès
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
            <h2>Profil utilisateur</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>NIF</Form.Label>
                    <Form.Control
                        type="text"
                        name="nif"
                        value={formData.nif}
                        onChange={handleChange}
                        required
                        readOnly // Champ non modifiable si nécessaire
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enregistrer les modifications
                </Button>
            </Form>
        </div>
    );
}

export default Profil;
