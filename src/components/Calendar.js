//AUTRE
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button,Table , Modal} from "react-bootstrap";
import { Row, Col} from "react-bootstrap";
import Aside from "../components/Aside";

import { Calendar,ConfigProvider , Badge} from "antd";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "antd/dist/reset.css";
import { QRCodeCanvas } from "qrcode.react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import moment from 'moment';

import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Import de la localisation française
import frFR from 'antd/es/locale/fr_FR'; // Import de la localisation Ant Design
dayjs.locale('fr'); 



function MyAntCalendar() {


    // Récupérer le mois actuel et l'année actuelle dynamiquement
    const currentMonth = moment().month(); // Mois actuel (indexé à 0 : Janvier = 0, Février = 1, etc.)
    const currentYear = moment().year();   // Année actuelle
    
    // État pour contrôler la visibilité du Sidebar
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    // Fonction pour basculer l'état
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    }

    //
    const [declarations, setDeclarations] = useState([]); // Données des déclarations
    // const [error, setError] = useState(""); // Gestion des erreurs

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});

    const userId = localStorage.getItem("userId");

    const handleDownloadPDF = async () => {
        const element = document.getElementById("pdf-content");
        if (!element) return;

        const canvas = await html2canvas(element, { scale: 2 });
        const imageData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Declaration_IRSA.pdf");
    };
// Récupération des données
    useEffect(() => {
        const fetchDeclarations = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/declarations/${userId}`
                );
                const sanitizedData = response.data.map((row) => ({
                    ...row,
                    ref: row.ref ? row.ref.toString() : "", // S'assurer que `ref` est une chaîne
                }));
                setDeclarations(sanitizedData); // Stocker les données
            } catch (err) {
                console.error("Erreur lors de la récupération des déclarations.");
            }
        };
        fetchDeclarations();
    }, [userId]);

    const handleMonthClick = async (selectedDate) => {
        // Formatez l'année et le mois sélectionnés
        const selectedYear = selectedDate.year(); // Année (moment.js)
        const selectedMonth = selectedDate.month()+1; // Mois (moment.js)
    
        // Mapping of month names to integer values
        const monthMapping = {
            janvier: 1,
            février: 2,
            mars: 3,
            avril: 4,
            mai: 5,
            juin: 6,
            juillet: 7,
            août: 8,
            septembre: 9,
            octobre: 10,
            novembre: 11,
            décembre: 12,
        };
        
        const monthDeclarations = Array.isArray(declarations) ? declarations.filter((declaration) => {
            // console.log("declaration:", declaration);
            // console.log("Mapped moisDec:", monthMapping[declaration.moisDec.toLowerCase()]);
            return (
                declaration.anneeDec === selectedYear &&
                monthMapping[declaration.moisDec.toLowerCase()] === selectedMonth
            );
        }) : [];
                
    
        // Si des déclarations existent, affichez-les dans la modal
        if (monthDeclarations.length > 0) {
            try {
                const firstDeclaration = monthDeclarations[0];
                if (firstDeclaration && firstDeclaration.ref) {
                    // Chargez les données détaillées pour la première déclaration
                    await rechDec(firstDeclaration.ref);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des détails de la déclaration :", error);
            }
    
            setShowModal(true); // Affichez la modal
        } else {
            console.log("Aucune déclaration pour la date sélectionnée.");
            // console.log("monthDeclarations.length:",monthDeclarations.length);
            // console.log("selectedYear:", selectedYear);
            // console.log("selectedMonth:", selectedMonth);
            // console.log("formData:", formData);



        }
    };
    

    // Cellule personnalisée pour afficher les données
    const getMonthData = (currentDate) => {
        // Obtenir l'année et le mois au format attendu
        const currentYear = currentDate.year(); // Utilisation de moment.js
        const currentMonth = currentDate.format("MMMM").toLowerCase(); // Mois en texte, en minuscules
     
        // Vérifier si des déclarations correspondent à l'année et au mois
        const hasDeclarations = declarations.some(
            (declaration) =>
                declaration.anneeDec === currentYear && // Comparaison de l'année
                declaration.moisDec.toLowerCase() === currentMonth // Comparaison du mois
        );
    
        if (hasDeclarations) {
            return (
                <Badge
                    status="success"
                    text="Déclaré"
                    style={{
                        backgroundColor: "#52c41a",
                        color: "white",
                        padding: "2px 5px",
                        borderRadius: "4px",
                    }}
                />
            );
        }
    
        return null;
    };
    
    
    // Fonction pour récupérer les informations détaillées d'une déclaration
    const rechDec = async (refDec) => {
        try {
            const response = await axios.get(`http://localhost:5000/declaration/${refDec}`);
            if (response.data) {
                setFormData(response.data[0]); // Assurez-vous de capturer le premier élément du tableau
            } else {
                console.error("Les données reçues sont invalides ou vides.");
                //setError("Aucune donnée trouvée pour cette déclaration.");
            }
            setShowModal(true); // Afficher le modal
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des informations :", error);
            //setError("Impossible de charger les informations de la déclaration.");
        }
        console.log(formData);
    };

    return (
        <div
            style={{
                backgroundColor: "rgb(245, 245, 250)", // Bright background
            }}
        >
        <Container fluid>
            <Row>
                {/* Sidebar (Aside) */}
                {isSidebarVisible && (
                    <Col md={2} className="p-0 bg-light sidebar">
                        <Aside />
                    </Col>
                )}

                 {/* Bouton pour cacher/afficher l'Aside */}
                <Col md={isSidebarVisible ? 10 : 12} className="p-4 main-content">
                    <main id="main" className="main" style={{
                        padding: "30px 30px 20px 30px",
                    
                    }}>
                        {/* Form Section */}
                        <section className="section">
                            <Row>
                            <Container
                                    style={{
                                        // maxWidth: "1100px",
                                        backgroundColor: "white", // White card background for contrast
                                        padding: "40px",
                                        
                                    }}
                            >
                              <Button
                                  variant="primary"
                                  onClick={toggleSidebar}
                                  style={{
                                      marginBottom: "40px",
                                      float:"left",
                                      borderRadius : "30px"
                                  }}
                              >
                                <i
                                    className={isSidebarVisible ? "bi bi-arrow-left" : "bi bi-arrow-right"}
                                    style={{
                                        fontSize: "1.5rem",
                                    }}
                                ></i>
                              </Button>

                              <div
                                id="calendar-container"
                              >
                                 <h1
                                  style={{
                                   textAlign:"right",
                                    marginBottom: "30px",
                                    fontSize: "23px",
                                    color: "#1890ff",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Vue Annuelle - Déclarations IRSA
                                </h1>
                                {/* <Button
                                  type="primary"
                                  style={{
                                    marginBottom: "20px",
                                    float: "right",
                                    borderRadius: "8px",
                                  }}
                                  onClick={() => handlePrint("calendar-container")} // Impression du calendrier
                                >
                                  Imprimer le Calendrier
                                </Button> */}
                                <ConfigProvider locale={frFR}>
                                <Calendar
                                    mode="year"
                                    fullscreen
                                    onSelect={handleMonthClick} // Appelle `handleMonthClick` avec la date sélectionnée
                                    validRange={[
                                        moment('2015-01-01'),
                                        moment(`${currentYear}-${currentMonth + 1}-31`, 'YYYY-MM-DD'),
                                    ]}
                                    headerRender={({ value, onChange }) => {
                                        const monthName = value.format('MMMM'); // Nom complet du mois
                                        const year = value.format('YYYY');

                                        // Navigation entre les années
                                        const previousYear = () => {
                                            const newValue = value.clone().subtract(1, 'year');
                                            onChange(newValue);
                                        };
                                        const nextYear = () => {
                                            const newValue = value.clone().add(1, 'year');
                                            onChange(newValue);
                                        };

                                        return (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "20px 0px",
                                                    borderRadius: "5px",
                                                }}
                                            >
                                                <div style={{ fontSize: "1.2em", fontWeight: "700", textTransform: "capitalize" }}>
                                                    {`${monthName} ${year}`}
                                                </div>

                                                <div>
                                                    <Button type="button" className="btn btn-success" onClick={previousYear}>
                                                        Précédent
                                                    </Button>
                                                    <Button
                                                        onClick={nextYear}
                                                        style={{ marginLeft: "8px"}}
                                                        type="button"
                                                        className="btn btn-success"
                                                    >
                                                        Suivant
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    }}
                                    cellRender={(currentDate, info) => {
                                        if (info.type === "month") {
                                            return getMonthData(currentDate); // Personnalisation des cellules
                                        }
                                        return null;
                                    }}
                                    style={{
                                        padding: "20px",
                                       
                                        fontSize: "1.1em",
                                    }}
                                />
                                </ConfigProvider>

                              </div>
                            </Container>
                            </Row>
                        </section>
                    </main>
                </Col>
                {/* ref={componentRef}  */}
                <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Résultats de la Déclaration</Modal.Title>
                    </Modal.Header>
                    <Modal.Body id="pdf-content" >
                        
                        <Container style={{
                                    // maxWidth: "1100px",
                                    backgroundColor: "white", // White card background for contrast
                                    padding: "20px",
                        }}>
                            
                            <div  className="border bg-light p-4">
                            <img src="Logo_dgi_2024.png" alt="logoDGI" style={{float:"right",width:"130px",height:"100px",position:"absolute"}}></img>
                                <h5 className="text-center">République de Madagascar</h5>
                                <h5 className="text-center">DIRECTION GENERALE DES IMPOTS</h5>
                                <h4 className="text-center mt-3">Accusé de Déclaration IRSA</h4>
                                
                                <hr />

                                 {/* QR Code généré */}
                                {formData.ref && (
                                    <div style={{ float :"right" }}>
                                    <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                    <Tooltip>
                                    nif : { formData.nif} <br></br>
                                    nom : {formData.nom} <br></br>
                                    periode : {formData.moisDec}-{formData.anneeDec}<br></br>
                                    revenuDéclare : {formData.revenuBase}<br></br>
                                    IRSA : {formData.irsaDu}<br></br>
                                    dateSoumission : {new Date(formData.dateDepot).toLocaleDateString("fr-FR")}
                                    
                                    </Tooltip>} // Affiche le contenu au survol
                                    >
                                    <div>
                                    <QRCodeCanvas
                                        value={
                                            "nif:"+formData.nif +
                                            "nom:"+formData.nom +
                                            "periode:"+formData.moisDec +"-" +formData.anneeDec +
                                            "revenuDéclare:"+formData.revenuBase +
                                            "IRSA:"+formData.irsaDu +
                                            "dateSoumission:"+new Date(formData.dateDepot).toLocaleDateString("fr-FR")
                                        }
                                        size={140}
                                        bgColor={"#ffffff"}
                                        fgColor={"#000000"}
                                        level={"H"}
                                    />

                                    </div>
                                    </OverlayTrigger>
                                    </div>
                                )}

                                <p className="text-start mt-1">
                                    <strong>NIF :</strong> {formData.nif}
                                </p>
                                <p className="text-start mt-1">
                                    <strong>Nom :</strong> {formData.nom} {formData.prenom}
                                </p>
                                <p className="text-start mt-1">
                                    <strong>Fonction :</strong> {formData.fonction}
                                </p>
                                <p className="text-start mt-1">
                                    <strong>Adresse email :</strong> {formData.email}
                                </p>
                                
                                <hr />
                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <td><strong>Référence Déclaration</strong></td>
                                            <td>{formData.ref}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Salaire de Base</strong></td>
                                            <td>{formData.revenuBase} Ar</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Cotisations</strong></td>
                                            <td>{formData.toutCotis} Ar</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Avantages</strong></td>
                                            <td>{formData.avantage} Ar</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Personnes à Charge</strong></td>
                                            <td>{formData.personneACharge}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Année</strong></td>
                                            <td>{formData.anneeDec}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Mois</strong></td>
                                            <td>{formData.moisDec}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>IRSA Dû</strong></td>
                                            <td>{formData.irsaDu} Ar</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Pénalités</strong></td>
                                            <td>{formData.deductionDep} Ar</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Date de Dépôt</strong></td>
                                            <td>{new Date(formData.dateDepot).toLocaleDateString("fr-FR")}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Statut</strong></td>
                                            <td>{formData.statut}</td>
                                        </tr>
                                        
                                    </tbody>
                                </Table>
                                <p className="text-end mt-5">
                                    <em>Fianarantsoa, le {new Date().toLocaleDateString("fr-MG")}</em>
                                </p>
                                <p className="text-end">
                                    <strong>Signature :</strong> ____________________________
                                </p>
                            </div>
    
                        </Container>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Fermer
                        </Button>
                        <Button variant="success" onClick={handleDownloadPDF}>
                            Télécharger le PDF
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Row>
        </Container>
        </div>
       
    );
}

export default MyAntCalendar;
