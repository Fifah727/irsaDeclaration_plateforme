import React, { useState,useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function Profil() {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        idDir: "",
        fonction: "",
        nom: "",
        prenom: "",
        cin: "",
        nif: "",
        mdp: "",
        email : ""
    });
   
    const [mdps, setMdps] = useState({
        mdpNew: "",
        mdpConf : ""
    });

    // IMAGE DU PROFIL : cin
    const [imageSrc, setImageSrc] = useState("default.jpg"); // Image par défaut


    // Charger les données utilisateur au chargement du composant
    const userId = localStorage.getItem("userId"); // Récupérer l'ID utilisateur depuis localStorage
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${userId}`);
                setFormData(response.data); // Remplir les données du formulaire
                if (response.data.cin >= 4) {
                    const fourthDigit = response.data.cin[3]; // Récupère le 4ᵉ chiffre du CIN
                    if (fourthDigit === "1") {
                        setImageSrc("woman.jpg"); // Image pour "fille"
                    } else if (fourthDigit === "0") {
                        setImageSrc("man.jpg"); // Image pour "homme"
                    } else {
                        setImageSrc("pasImage.png"); // Image par défaut si autre valeur
                    }
                } else {
                    setImageSrc("pasImage.png"); // Image par défaut si le CIN est trop court
                }
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

    // Charger les données directions depuis le backend
    const [directions, setDirections] = useState([]); // État pour stocker les directions
    useEffect(() => {
        const fetchDirections = async () => {
            try {
                const response = await axios.get('http://localhost:5000/directions');
                setDirections(response.data); // Mise à jour des directions
            } catch (error) {
                console.error("Erreur lors de la récupération des directions :", error);
                setError("Impossible de charger les directions.");
            }
        };
    
        fetchDirections();
    }, []);


    // Fonction pour afficher/masquer les mots de passe
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMdp = (e) => {
        const { name, value } = e.target;
        setMdps({ ...mdps, [name]: value });
    };

    const validateForm = () => {
        const { idDir, fonction, nom, prenom, cin, nif, mdp, email } = formData;
        const {mdpNew,mdpConf} = mdps;

        if (!idDir || !fonction || !nom || !prenom || !cin || !nif || !mdp || !email) {
            return "Tous les champs sont obligatoires.";
        }

        if (cin.length !== 12 || (cin[3] !== "0" && cin[3] !== "1")) {
            return "Le CIN doit comporter 12 chiffres, avec le 4ème chiffre étant 0 ou 1.";
        }

        if (nif.length !== 10 || !/^\d{10}$/.test(nif)) {
            return "Le NIF doit comporter exactement 10 chiffres.";
        }

        if (mdpNew !== mdpConf) {
            return "Veuillez vérifier votre mot de passe.";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorMessage = validateForm();
        if (errorMessage) {
            setError(errorMessage);
            setSuccess("");
            return;
        }
        //const {mdpNew,mdpConf} = mdps;
        // SI changer mdp -> rediriger vers login
        if (mdps.mdpNew || mdps.mdpConf) {
            try {
                const response = await axios.put(`http://localhost:5000/users/${userId}`,{
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    idDir: formData.idDir,
                    fonction: formData.fonction,
                    cin: formData.cin,
                    nif: formData.cin,
                    
                    mdp: mdps.mdpConf,
                }); // Envoyer les modifications
                setSuccess(response.message);
                setError(""); // Réinitialiser les erreurs
                
                window.location.href = "/login"; 
                
            } catch (error) {
                console.error("Erreur lors de la mise à jour des informations utilisateur :", error);
                setError("Une erreur est survenue lors de la mise à jour.");
                setSuccess(""); // Réinitialiser le succès
            }
        }
        // sinon on ne change le mdp
        else{
            try {
                const response = await axios.put(`http://localhost:5000/users/${userId}`, {
                    nom: formData.nom,
                    prenom: formData.prenom,
                    email: formData.email,
                    idDir: formData.idDir,
                    fonction: formData.fonction,
                    cin: formData.cin,
                    nif: formData.cin,
                    mdp: formData.mdp,
                }); // Envoyer les modifications
                setSuccess(response.message);
                setError(""); // Réinitialiser les erreurs 
            } catch (error) {
                console.error("Erreur lors de la mise à jour des informations utilisateur :", error);
                setError("Une erreur est survenue lors de la mise à jour.");
                setSuccess(""); // Réinitialiser le succès
            }
        }
        
    };

    return (
        <div
            style={{
                background: "rgb(245, 245, 250)", // Background color
                // minHeight: "100vh", // Full viewport height
                padding: "70px 0", // Top and bottom padding
            }}
          
        >
            <Container  style={{
                    // maxWidth: "1100px",
                    backgroundColor: "white", // White card background for contrast
                    padding: "50px",
                }}>
                <Row>
                    {/* Profile Image Section */}
                    <Col md={3} className="border-end">
                        <div className="d-flex flex-column align-items-center text-center py-5">
                            <img
                                className="rounded-circle"
                                width="150px"
                                src={imageSrc}
                                alt="Profile"
                            />
                            <span className="font-weight-bold mt-3">{formData.nom} {formData.prenom}</span>
                            <span className="text-black-50">{formData.fonction}</span>
                        </div>
                    </Col>

                    {/* Profile Information Section */}
                    <Col md={9}>
                        <div className="py-4">
                            <h4
                                className="text-center mb-4"
                                style={{
                                    fontWeight: "600",
                                    color: "rgb(21, 41, 66)",
                                }}
                            >
                                Paramètres de votre profil
                            </h4>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Direction</Form.Label>
                                            <Form.Select
                                                name="idDir"
                                                value={formData.idDir}
                                                onChange={handleChange}
                                                required
                                                style={{
                                                    borderRadius: "8px",
                                                    borderColor: "#ccc",
                                                }}
                                            >
                                                <option value="">Choisissez une Direction</option>
                                                {directions.map((direction) => (
                                                    <option key={direction.idDir} value={direction.idDir}>
                                                        {direction.nomDir} - {direction.regionDir}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                           
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Fonction</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fonction"
                                                value={formData.fonction}
                                                onChange={handleChange}
                                                placeholder="Entrez le fonction"
                                                required
                                                style={{
                                                    borderRadius: "8px",
                                                    borderColor: "#ccc",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                                placeholder="Entrez le nom"
                                                required
                                                style={{
                                                    borderRadius: "8px",
                                                    borderColor: "#ccc",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="prenom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                                placeholder="Entrez le prénom"
                                                required
                                                style={{
                                                    borderRadius: "8px",
                                                    borderColor: "#ccc",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>CIN</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="cin"
                                                value={formData.cin}
                                                onChange={handleChange}
                                                placeholder="Entrez le CIN (12 chiffres)"
                                                readOnly
                                                style={{
                                                    borderRadius: "8px",
                                                    borderColor: "#ccc",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>NIF</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nif"
                                                value={formData.nif}
                                                onChange={handleChange}
                                                placeholder="Entrez le NIF (10 chiffres)"
                                                readOnly
                                                style={{
                                                    borderRadius: "8px",
                                                    borderColor: "#ccc",
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Entrez votre email"
                                       
                                        style={{
                                            borderRadius: "8px",
                                            borderColor: "#ccc",
                                        }}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col xs={12} sm={6} className="mb-3">
                                        <div className="mb-2">
                                            <b>Changer le mot de passe</b>
                                        </div>
                                        {/* <Form.Group className="mb-3">
                                            <Form.Label>Mot de passe actuel</Form.Label>
                                            <Form.Control
                                                id="mdpActuell"
                                                value={formData.mdp}
                                                type={showPassword ? "text" : "password"}
                                                defaultValue="VotreMotDePasseActuel" // Exemple, remplacez par votre logique
                                                readOnly
                                            />
                                        </Form.Group> */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nouveau mot de passe</Form.Label>
                                            <Form.Control
                                                name="mdpNew"
                                                onChange={handleMdp}
                                                id="mdpNew"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Nouveau mot de passe"
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirmer <span className="d-none d-xl-inline">Password</span></Form.Label>
                                            <Form.Control
                                                name="mdpConf"
                                                id="mdpConf"
                                                // value={formData.mdp}
                                                onChange={handleMdp}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirmer le mot de passe"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={5} className="offset-sm-1 mb-3">
                                        <Form.Group>
                                            <Form.Check
                                                type="checkbox"
                                                id="notifications-offers"
                                                label="Montrer les mots de passe"
                                                onChange={toggleShowPassword}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {error && (
                                    <Alert variant="danger" className="mb-3">
                                        {error}
                                    </Alert>
                                )}
                                {success && (
                                    <Alert variant="success" className="mb-3">
                                        {success}
                                    </Alert>
                                )}

                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        style={{
                                            backgroundColor: "rgb(21, 41, 66)",
                                            color: "white",
                                            border: "none",
                                            padding: "10px 20px",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Sauvegarder
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Profil;
