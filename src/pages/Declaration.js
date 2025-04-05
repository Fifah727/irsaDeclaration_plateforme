import React, { useState,useMemo,useEffect } from "react";
import { Container, Form, Row, Col, Button, Alert, Modal, ProgressBar } from "react-bootstrap";
import axios from 'axios';
import styled from 'styled-components';

// Couleurs basées sur votre description
const primaryColor = "#1a202c"; // Bleu foncé (similaire à votre barre latérale/footer)
const secondaryColor = "#4cbaceff"; // Bleu clair (accent)
const textColorDark = "rgb(21, 41, 66)"; // Texte foncé
const textColorLight = "#f9fafb"; // Texte clair
const backgroundColorLight = "rgb(245, 245, 250)"; // Fond clair
const formBackgroundColor = "white";
const errorBackgroundColor = "#f8d7da";
const errorBorderColor = "#f5c6cb";
const errorTextColor = "#721c24";
const buttonDangerBackground = "#FFC7CDFF";

// Styles globaux pour la page
const PageContainer = styled.div`
  background-color: ${backgroundColorLight};
  padding: 10px 0;
  min-height: 100vh; /* Assure que le fond couvre toute la hauteur */
  font-family: 'Roboto', sans-serif;
`;

const FormContainer = styled(Container)`
  background-color: ${formBackgroundColor};
  color: ${textColorDark};
  padding: 60px;
  box-shadow: 0 5px 8px rgba(0, 0, 0, 0.08);
  max-width: 1000px;
  margin: 60px auto;
`;

const FormHeader = styled.h2`
  color: ${primaryColor};
  margin-bottom: 30px;
  text-align: center;
`;

const StyledForm = styled(Form)`
  /* Pas de styles spécifiques pour l'instant */
`;

const FormGroup = styled(Form.Group)`
  margin-bottom: 25px;
`;

const FormLabel = styled(Form.Label)`
  font-weight: 600;
  color: ${textColorDark};
  margin-bottom: 8px;
`;

const FormControl = styled(Form.Control)`
  border: 1px solid #ddd;
  background-color: ${formBackgroundColor};
  color: ${textColorDark};
  padding: 12px 15px;
  font-size: 1rem;
  border-radius: 8px;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    border-color: <span class="math-inline">\{secondaryColor\};
box\-shadow\: 0 0 0 0\.2rem rgba\(</span>{parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.25);
  }
`;

const ErrorAlert = styled(Alert)`
  margin-top: 30px;
  border-radius: 8px;
  background-color: ${errorBackgroundColor};
  border-color: ${errorBorderColor};
  color: ${errorTextColor};
  font-weight: 600;
  padding: 15px;
`;

const SubmitButton = styled(Button)`
  background-color: ${primaryColor};
  color: ${textColorLight};
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 25px;
  border-radius: 8px;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: ${primaryColor}e0; /* Légèrement éclairci au hover */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ResetButton = styled(Button)`
  background-color: ${buttonDangerBackground};
  color: ${textColorDark};
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 25px;
  border-radius: 8px;
  margin-right: 20px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${buttonDangerBackground}e0; /* Légèrement éclairci au hover */
  }
`;

const DataSummary = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 0.9rem;

  h6 {
    font-weight: bold;
    color: ${textColorDark};
    margin-bottom: 10px;
    text-align: center;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 8px 12px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      font-weight: 600;
      color: ${primaryColor};
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
`;

function Declaration() {
    const today = new Date();

    // Récupérer les composants (année, mois, jour)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0, donc on ajoute 1
    const day = String(today.getDate()).padStart(2, '0');
    
    // Format final "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;
    const [emailChecked, setEmailChecked] = useState(false);
    // START MODALS CODES
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showEmailEnvoyeModal, setShowEmailEnvoyeModal] = useState(false);
    const [progress, setProgress] = useState(0);
    const userId = useMemo(() => localStorage.getItem("userId"), []); // Mémoriser userId
    
    const [formData, setFormData] = useState({
        revenuBase: "",
        toutCotis: "",
        avantage: "",
        personneACharge: "",
        anneeDec: "",
        moisDec: "",
        deductionDep: "",
        idu : userId,
        irsaDu : "",
        statut : "Soumis",
        dateDepot : formattedDate,
    });
    const emailId = useMemo(() => localStorage.getItem("emailId"), []); // Mémoriser emailId
    const [emailDeclaration, setEmailDeclaration] = useState({
        to: emailId,
        subject: "Déclaration d'impôt IRSA",
        text:"Les détails de votre déclaration : ",
    });
  
    // Récupération des mois et années déjà déclarés
    const fetchDeclarations = async () => {
        try {
            const response = await fetch(`http://localhost:5000/moisAnsDeclare/${userId}`);
            const data = await response.json();
            setmoisAndejadeclare(data);
        } catch (err) {
            console.error("Erreur lors du fetch des déclarations :", err);
        }
    };

    useEffect(() => {
        fetchDeclarations();
    })
   

    const handleShowProgressModal = async () => {
        setShowProgressModal(true); // Affiche le modal de progression
        setProgress(10); // Initialise la progression à 10 %
        let isSubmitting = false; // Verrou pour éviter les doubles soumissions
    
        // Transformer le mois en texte
        const months = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ];
        const monthName = months[+formData.moisDec.split("-")[1] - 1];
        const modifiedFormData = { ...formData, moisDec: monthName };
    
        if (!isSubmitting) {
            isSubmitting = true; // Empêche les doubles soumissions
    
            try {
                // Simuler une progression jusqu'à 85 % avant la fin de la requête
                const simulatedProgress = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= 85) {
                            clearInterval(simulatedProgress); // Stoppe la progression à 85 %
                        }
                        return prev + 15; // Incrémente par 15 %
                    });
                }, 400); // Mise à jour toutes les 400ms
    
                // Exécute l'insertion dans le backend
                await axios.post("http://localhost:5000/insertDec", modifiedFormData);
    
                // Une fois la requête terminée, atteindre 100 %
                setProgress(100);
    
                // Affiche directement le modal de succès
                setTimeout(() => {
                    setShowConfirmationModal(true); // Affiche le modal de confirmation
                    setShowProgressModal(false); // Cache le modal de progression
                }, 400); // Petit délai pour bien afficher la barre à 100 %
            } catch (error) {
                console.error("Erreur lors de l'enregistrement :", error);
    
                if (error.response && error.response.status === 400) {
                    setError(error.response.data.message);
                } else {
                    setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
                }
            } finally {
                isSubmitting = false; // Réinitialise le verrou
            }
        }

        fetchDeclarations();
       

    };
    

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
        setProgress(0); // Réinitialise la barre
    };

    const handleContinue = async () => {
        if (emailChecked) {
            emailDeclaration.text = `
                Les détails de votre déclaration :
                - Revenu de base : ${formData.revenuBase}
                - Total des cotisations : ${formData.toutCotis}
                - Avantages : ${formData.avantage}
                - Personnes à charge : ${formData.personneACharge}
                - Année de déclaration : ${formData.anneeDec}
                - Mois de déclaration : ${formData.moisDec}
                - Déduction pour dépenses : ${formData.deductionDep}
                - IRSA dû : ${formData.irsaDu}
                - Statut : ${formData.statut}
                - Date de dépôt : ${formData.dateDepot}
                - Fin de paiement : ${calculatePaymentDeadline(formData.dateDepot)}
            `;
            // Envoi de l'e-mail
            try {
                const emailResponse = await axios.post(
                    "http://localhost:5000/send-email",
                    emailDeclaration
                );
                console.log("Email envoyé avec succès :", emailResponse.data);
                setShowEmailEnvoyeModal(true);
                resetForm();
            } catch (error) {
                console.error("Erreur lors de l'envoi de l'email :", error);
            }
        }
    
        handleCloseConfirmationModal(); // Ferme le modal
    };
    
    const handleCloseEmailEnvoyeModal = () => {
        setShowEmailEnvoyeModal(false);
    }
   
    const [moisAndejadeclare, setmoisAndejadeclare] = useState([]); // Stocke les données existantes
    const [irsaCalculé, setIrsaCalculé] = useState(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const currentYear = new Date().getFullYear();
    //const currentMonth = new Date().getMonth() + 1; // Les mois commencent à 0, donc +1
    const convertMonthToText = (monthNumeric) => {
        const months = [
            "janvier", "février", "mars", "avril", "mai", "juin",
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"
        ];
    
        const monthIndex = parseInt(monthNumeric.split("-")[1], 10) - 1; // Index basé sur le mois (1-12)
        return months[monthIndex]; // Retourne le nom du mois (exemple : "janvier")
    };
    
    const handleChange = (e) => {
       
        const { name, value } = e.target;

        // Validation immédiate
        if (["revenuBase", "toutCotis", "avantage", "deductionDep"].includes(name) && parseFloat(value) < 0) {
            setError("Les montants doivent être positifs.");
            return;
        }

        if (name === "anneeDec") {
            if (parseInt(value, 10) > currentYear){
                setError(`L'année de déclaration ne peut pas dépasser ${currentYear}.`);
                return;
            }
            // Met à jour l'année et ajuste le mois (si sélectionné)
            setFormData((prev) => ({
                ...prev,
                anneeDec: value,
                moisDec: prev.moisDec ? `${value}-${prev.moisDec.split("-")[1]}` : "", // Ajuste l'année dans "moisDec"
            }));
        } 
       
        if (name === "moisDec") {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear(); // Année actuelle
            const currentMonth = currentDate.getMonth() + 1; // Mois actuel (0-indexé, donc +1)
        
            // Extrait l'année et le mois du mois choisi
            const selectedYear = parseInt(value.split("-")[0], 10); // Convertit en entier
            const selectedMonth = parseInt(value.split("-")[1], 10); // Convertit en entier
        
            // Validation : Si l'année est supérieure à l'année actuelle
            if (selectedYear > currentYear) {
                setError(`L'année de déclaration ne peut pas dépasser ${currentYear}.`);
                return; // Stoppe l'exécution si l'année est invalide
            }
        
            // Validation : Si l'année est la même mais que le mois dépasse le mois actuel
            if (selectedYear === currentYear && selectedMonth > currentMonth) {
                setError(
                    `Le mois de déclaration ne peut pas dépasser ${currentYear}-${String(
                        currentMonth
                    ).padStart(2, "0")}.`
                );
                return; // Stoppe l'exécution si le mois est invalide
            }
            //
            // console.log("Mois formdata : "+convertMonthToText(value));
            // console.log("Annee formData : "+value.split("-")[0]);
            const isDuplicate = moisAndejadeclare.some((dec) => {
                 // Vérifie la validité des données avant comparaison
                if (!dec || !dec.moisDec || !dec.anneeDec || !value) {
                    console.warn("Données invalides détectées :", dec, value);
                    return false; // Ignorer si des données sont incorrectes
                }

                const databaseMonthText = dec.moisDec.trim().toLowerCase(); // Normalise le mois de la base
                const userMonthText = convertMonthToText(value).trim().toLowerCase(); // Normalise le mois utilisateur
                const databaseYearText = typeof dec.anneeDec === "string" ? dec.anneeDec.trim() : String(dec.anneeDec);
                const userYearText = value.split("-")[0].trim(); // Normalise l'année utilisateur

                // console.log(`Comparaison exacte : "${databaseMonthText}" === "${userMonthText}"`,
                //     `et "${databaseYearText}" === "${userYearText}"`);

                return (
                    databaseMonthText === userMonthText && databaseYearText === userYearText
                );
            });
            // console.log("isDuplicate :", isDuplicate);

            // console.log("dec.moisDec.toLowerCase() :"+dec.moisDec.toLowerCase()+"=== userMonthText.toLowerCase()"+  userMonthText.toLowerCase());
            if (isDuplicate) {
                setError("Cette déclaration dans cette période existe déjà !");
                return;
            } 
            //
        
            // Si la date est valide, met à jour les données
            setFormData((prev) => ({
                ...prev,
                moisDec: value, // Met à jour le mois
                anneeDec: selectedYear.toString(), // Met à jour l'année pour correspondre au mois choisi
            }));
        
            // Réinitialise l'erreur après une sélection valide
            setError("");
        }
       

        setError(""); // Réinitialisation des erreurs
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const { revenuBase, toutCotis, avantage, personneACharge, anneeDec, moisDec, deductionDep } = formData;

        if (!revenuBase || !toutCotis || !avantage || !personneACharge || !anneeDec || !moisDec) {
            return "Tous les champs obligatoires doivent être remplis.";
        }

        if (parseFloat(revenuBase) <= 0 || parseFloat(toutCotis) < 0 || parseFloat(avantage) < 0 || parseFloat(deductionDep) < 0) {
            return "Les montants doivent être positifs.";
        }

        if (!Number.isInteger(Number(personneACharge)) || parseInt(personneACharge, 10) < 0) {
            return "Le nombre de personnes à charge doit être un entier positif.";
        }

        if (parseInt(anneeDec, 10) > currentYear) {
            return `L'année de déclaration ne peut pas dépasser ${currentYear}.`;
        }

        // if (parseInt(anneeDec, 10) === currentYear && parseInt(moisDec, 10) > currentMonth) {
        //     return `Pour l'année ${currentYear}, le mois ne peut pas dépasser ${currentMonth}.`;
        // }
       
        return ""; // Aucune erreur
    };

    const calculerIRSA = () => {
        const revenuBase = parseFloat(formData.revenuBase || 0);
        const toutCotis = parseFloat(formData.toutCotis || 0);
        const avantage = parseFloat(formData.avantage || 0);
        const personneACharge = (parseInt(formData.personneACharge || 0, 10)) * 2000;
        const deductionDep = parseFloat(formData.deductionDep || 0);

        let salaireImposable = revenuBase + avantage + toutCotis - personneACharge;

        let irsa = 3000;
        let taux = 0;

        if (salaireImposable > 600000 /*&& salaireImposable <= 625500*/) {
            taux = 0.20;
            irsa = salaireImposable * taux;
        } else if (salaireImposable > 500000 && salaireImposable <= 600000) {
            taux = 0.15;
            irsa = salaireImposable * taux;
        } else if (salaireImposable > 400000 && salaireImposable <= 500000) {
            taux = 0.10;
            irsa = salaireImposable * taux;
        } else if (salaireImposable > 350000 && salaireImposable <= 400000) {
            taux = 0.05;
            irsa = salaireImposable * taux;
        } else if (salaireImposable <= 350000) {
            taux = 0;
            irsa = 3000;
        }
        //irsa += deductionDep;
        formData.irsaDu = irsa;
        return {
            irsa: irsa.toFixed(0),
            deductionDep: deductionDep.toFixed(0),
            taux : taux,
            salaireImposable: salaireImposable.toFixed(0),
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errorMessage = validateForm();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        setError("");
        const result = calculerIRSA();
        setIrsaCalculé(result);
        setShowModal(true);

       
    };

    const submitForm = () => {
        setShowModal(false);
        handleShowProgressModal();
    };

    const resetForm = () => {
        setFormData({
            revenuBase: "",
            toutCotis: "",
            avantage: "",
            personneACharge: "",
            anneeDec: "",
            moisDec: "",
            deductionDep: "",
            idu:userId ,
            irsaDu: "",
            statut: "Soumis",
            dateDepot : formattedDate,
        });
        setError("");
    }

    const calculatePaymentDeadline = (declarationDate) => {
        const declaration = new Date(declarationDate); // Convertit la date de déclaration en objet Date
        
        const paymentYear = declaration.getFullYear(); // Année de la déclaration
        const paymentMonth = declaration.getMonth() + 2; // Mois suivant (+1 pour indexation, +1 pour le mois suivant)
        
        const paymentDeadline = new Date(paymentYear, paymentMonth - 1, 15); // Date au 15 du mois suivant
        
        return paymentDeadline.toLocaleDateString("fr-FR"); // Formate la date au format français
    };
   

   

    
  return (
    <PageContainer>
      <FormContainer>
        <FormHeader id="header_3" data-component="header">Remplissez les champs suivants</FormHeader>
        <hr />
        <StyledForm onSubmit={handleSubmit} id="formDec">
          <Row>
            <Col md={6} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Salaire de Base</FormLabel>
                <FormControl
                  type="number"
                  name="revenuBase"
                  value={formData.revenuBase}
                  onChange={handleChange}
                  placeholder="Entrez le salaire de base"
                  required
                  min="350000"
                  step="1000"
                />
              </FormGroup>
            </Col>
            <Col md={6} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Total Cotisations</FormLabel>
                <FormControl
                  type="number"
                  name="toutCotis"
                  value={formData.toutCotis}
                  onChange={handleChange}
                  placeholder="Entrez le total des cotisations"
                  min="0"
                  step="100"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Avantages</FormLabel>
                <FormControl
                  type="number"
                  name="avantage"
                  value={formData.avantage}
                  onChange={handleChange}
                  placeholder="Entrez les avantages"
                  min="0"
                  step="100"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Personnes à Charge</FormLabel>
                <FormControl
                  type="number"
                  name="personneACharge"
                  value={formData.personneACharge}
                  onChange={handleChange}
                  placeholder="Nombre de personnes à charge"
                  min="0"
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Pénalité</FormLabel>
                <FormControl
                  type="number"
                  name="deductionDep"
                  value={formData.deductionDep}
                  onChange={handleChange}
                  placeholder="Entrez les pénalités (s'il y en a)"
                  min="0"
                  step="100"
                />
              </FormGroup>
            </Col>
            <Col md={6} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Année de Déclaration</FormLabel>
                <FormControl
                  type="number"
                  name="anneeDec"
                  value={formData.anneeDec}
                  onChange={handleChange}
                  placeholder="Entrez l'année (ex : 2023)"
                  required
                  min="2020"
                  max="2100"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mb-4">
              <FormGroup>
                <FormLabel style={{ fontWeight: "600" }}>Mois de Déclaration</FormLabel>
                <FormControl
                  type="month"
                  name="moisDec"
                  value={formData.moisDec}
                  onChange={handleChange}
                  placeholder="Entrez le mois"
                  required
                />
              </FormGroup>
            </Col>
          </Row>

          {error && (
            <Alert
              className="mt-4"
              variant="danger"
              style={{
                borderRadius: "8px",
                backgroundColor: "#f8d7da",
                borderColor: "#f5c6cb",
                color: "#721c24",
                fontWeight: "600",
              }}
            >
              {error}
            </Alert>
          )}
          <hr />
          <DataSummary>
            <table className="table table-sm table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th colSpan={2} style={{ textAlign: "center", fontWeight: "600", color: "#333" }}>
                    RESUME DE VOS DONNEES
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Revenu de base</td>
                  <td>{formData.revenuBase || "Non défini"}</td>
                </tr>
                <tr>
                  <td>Total des cotisations</td>
                  <td>{formData.toutCotis || "Non défini"}</td>
                </tr>
                <tr>
                  <td>Avantages</td>
                  <td>{formData.avantage || "Non défini"}</td>
                </tr>
                <tr>
                  <td>Personnes à charge</td>
                  <td>{formData.personneACharge || "Non défini"}</td>
                </tr>
                <tr>
                  <td>Année de déclaration</td>
                  <td>{formData.anneeDec || "Non défini"}</td>
                </tr>
                <tr>
                  <td>Mois de déclaration</td>
                  <td>{formData.moisDec || "Non défini"}</td>
                </tr>
                <tr>
                  <td>Déduction pour dépenses</td>
                  <td>{formData.deductionDep || "Non défini"}</td>
                </tr>
              </tbody>
            </table>
          </DataSummary>
          <hr />

          <div className="text-center" style={{ marginTop: "30px" }}>
            <ResetButton
              type="button"
              onClick={resetForm}
              style={{ marginRight: "30px" }}
            >
              Tout annuler
            </ResetButton>

            <SubmitButton
              variant="primary"
              type="submit"
            >
              Calculer l'IRSA
            </SubmitButton>
          </div>
        </StyledForm>

        <Modal show={showModal} id="resDec" backdrop="static" onHide={() => setShowModal(false)} centered>
          <Modal.Header>
            <Modal.Title>Résultats de la Déclaration</Modal.Title>
          </Modal.Header>
          <Modal.Body id="pdf-content">
            {irsaCalculé && (
              <>
                <p>
                  <strong>Salaire Imposable :</strong> {irsaCalculé.salaireImposable} Ar
                </p>
                <p>
                  <strong>Taux :</strong> {parseFloat(irsaCalculé.taux) * 100} %
                </p>
                <p>
                  <strong>IRSA Calculé :</strong> {irsaCalculé.irsa} Ar
                </p>

                <p>
                  <strong>Pénalité :</strong> {irsaCalculé.deductionDep} Ar
                </p>
                <p>
                  <strong>Total à Payer :</strong> <span style={{ color: "blue" }}> {parseFloat(irsaCalculé.irsa) + parseFloat(irsaCalculé.deductionDep)} Ar </span>
                </p>
                <p>
                  <strong>Fin de paiement :</strong> {calculatePaymentDeadline(formData.dateDepot)}
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Aborter
            </Button>
            <Button variant="success" onClick={() => submitForm()}>
              Valider
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODALS */}
        {/* Modal de progression */}
        <Modal
          show={showProgressModal}
          centered
          dialogClassName="progress-modal-style"
          animation
        >
          <Modal.Body
            style={{
              backgroundColor: "#f7f9fc",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Titre amélioré */}
            <h5
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "18px",
                fontWeight: "bold",
                color: "#1a73e8",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Soumission en cours...
            </h5>

            {/* Barre de progression modernisée */}
            <ProgressBar
              animated
              now={progress}
              label={`${progress}%`}
              style={{
                height: "25px",
                backgroundColor: "#e8efff",
                color: "#333",
                borderRadius: "4px",
                overflow: "hidden",
                fontWeight: "bold",
              }}
            />
          </Modal.Body>

          <style>
            {`
              /* Animation personnalisée pour la barre */
              .progress-modal-style .modal-content {
              box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
              animation: scaleUp 0.5s ease-out;
              }

              @keyframes scaleUp {
              from {
                opacity: 0;
                transform: scale(0.9);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
              }
            `}
          </style>
        </Modal>

        {/* Modal de confirmation */}
        <Modal
          show={showConfirmationModal}
          onHide={handleCloseConfirmationModal}
          centered
          dialogClassName="modal-style"
          backdrop="static" // Empêche la fermeture en cliquant à l'extérieur
          keyboard={false}   // Désactive la fermeture via la touche Escape
          animation
        >
          <Modal.Header style={{ borderBottom: "1px solid #CCC" }}>
            <Modal.Title className="text-center w-100">
              <h4 style={{ color: "#4CAF50", fontWeight: "bold" }}>
                Soumission effectué avec succès
              </h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Check
              type="checkbox"
              label="Recevoir par email les détails"
              onChange={(e) => setEmailChecked(e.target.checked)}
              style={{
                fontSize: "17px",
                color: "#555",
                margin: "10px 0",
              }}
            />
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "right", borderTop: "1px solid #ccc" }}>
            <Button
              variant="primary"
              onClick={handleContinue}
              style={{
                background: "#007BFF",
                border: "none",
              }}
            >
              Continuer
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Modal de confirmation */}
        <Modal
          show={showEmailEnvoyeModal}
          onHide={handleCloseEmailEnvoyeModal}
          centered
          dialogClassName="modal-style"
          backdrop="static" // Empêche la fermeture en cliquant à l'extérieur
          keyboard={false}   // Désactive la fermeture via la touche Escape
          animation
        >
          <Modal.Header style={{ borderBottom: "1px solid #CCC" }}>
            <Modal.Title className="text-center w-100">
              <h4 style={{ color: "#4CAF50", fontWeight: "bold" }}>
                Email envoyé
              </h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Veuillez vérifiez votre email, nous vous avons envoyé les détails de la déclaration.</p>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "right", borderTop: "1px solid #ccc" }}>
            <Button
              variant="primary"
              onClick={handleCloseEmailEnvoyeModal}
              style={{
                background: "#007BFF",
                border: "none",
              }}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>

      </FormContainer>
    </PageContainer>
  );
}

export default Declaration;

