//AUTRE
import React, { useState, useEffect , useMemo } from "react";
import axios from "axios";
import { Table, Container,Form, Pagination, InputGroup, Button,Modal } from "react-bootstrap";
import { FaPrint } from "react-icons/fa";
import { Row, Col} from "react-bootstrap";
import Aside from "../components/Aside";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function DeclarationTable() {
        // États pour les déclarations et la pagination
        const [declarations, setDeclarations] = useState([]);
        const [error, setError] = useState("");
        const [search, setSearch] = useState("");
        const [perPage, setPerPage] = useState(5);
        const [currentPage, setCurrentPage] = useState(1);
    
        // État pour le sidebar
        const [isSidebarVisible, setSidebarVisible] = useState(true);
        const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
    
        const userId = useMemo(() => localStorage.getItem("userId"), []); // Mémoriser userId
   
        useEffect(() => {
            const fetchDeclarations = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/declarations/${userId}`);
                    const sanitizedData = response.data.map((row) => ({
                        ...row,
                        ref: row.ref ? row.ref.toString() : "", // Assurer que `ref` est une chaîne
                    }));
                    setDeclarations(sanitizedData);
                } catch (err) {
                    console.error("Erreur lors de la récupération des déclarations :", err);
                    setError("Erreur lors de la récupération des déclarations.");
                }
            };
    
            if (userId) {
                fetchDeclarations(); // Appeler uniquement si l'userId est défini
            }
        }, [userId]);
   
       // Mémorisation des données filtrées pour éviter des calculs inutiles
       const filteredData = useMemo(() => {
           const searchTerm = search.toLowerCase();
           return declarations.filter((row) => {
               const columns = [
                   row.ref ? row.ref.toString().toLowerCase() : "",
                   row.revenuBase ? row.revenuBase.toString() : "",
                   row.toutCotis ? row.toutCotis.toString() : "",
                   row.avantage ? row.avantage.toString() : "",
                   row.personneACharge ? row.personneACharge.toString() : "",
                   row.anneeDec ? row.anneeDec.toString() : "",
                   row.moisDec ? row.moisDec.toLowerCase() : "",
                   row.irsaDu ? row.irsaDu.toString() : "",
                   row.deductionDep ? row.deductionDep.toString() : "",
                   row.dateDepot ? new Date(row.dateDepot).toLocaleDateString("fr-FR").toLowerCase() : "",
                   row.statut ? row.statut.toLowerCase() : "",
               ];
               return columns.some((col) => col.includes(searchTerm));
           });
       }, [declarations, search]);
   
       const totalPages = useMemo(() => Math.ceil(filteredData.length / perPage), [filteredData, perPage]);
       const paginatedData = useMemo(() => filteredData.slice((currentPage - 1) * perPage, currentPage * perPage), [filteredData, currentPage, perPage]);
   
       const [showModal, setShowModal] = useState(false);
   
        const [formData, setFormData] = useState({});

          // Fonction pour récupérer les informations détaillées d'une déclaration
        const rechDec = async (refDec) => {
            try {
                const response = await axios.get(`http://localhost:5000/declaration/${refDec}`);
                if (response.data) {
                    setFormData(response.data[0]); // Assurez-vous de capturer le premier élément du tableau
                } else {
                    console.error("Les données reçues sont invalides ou vides.");
                    setError("Aucune donnée trouvée pour cette déclaration.");
                }
                setShowModal(true); // Afficher le modal
                console.log(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations :", error);
                setError("Impossible de charger les informations de la déclaration.");
            }
            console.log(formData);
        };
   
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

       const calculatePaymentDeadline = (declarationDate) => {
        const declaration = new Date(declarationDate); // Convertit la date de déclaration en objet Date
        
        const paymentYear = declaration.getFullYear(); // Année de la déclaration
        const paymentMonth = declaration.getMonth() + 2; // Mois suivant (+1 pour indexation, +1 pour le mois suivant)
        
        const paymentDeadline = new Date(paymentYear, paymentMonth - 1, 15); // Date au 15 du mois suivant
        
        return paymentDeadline.toLocaleDateString("fr-FR"); // Formate la date au format français
        };
   
       if (error) {
           return <p style={{ color: "red" }}>{error}</p>;
       }
   
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
                                        padding: "30px",
                                        minHeight: "100vh",
                                    }}
                            >
                                <Button
                                    variant="primary"
                                    onClick={toggleSidebar}
                                    style={{
                                       
                                        borderRadius : "30px",
                                        float : "left"
                                    }}
                                >
                                    <i
                                        className={isSidebarVisible ? "bi bi-arrow-left" : "bi bi-arrow-right"}
                                        style={{
                                            fontSize: "1.5rem",
                                        }}
                                    ></i>
                                </Button>
                                {/* LOGO DGI */}
                                
                                <h1
                                  style={{
                                   textAlign:"right",
                                    marginBottom: "50px",
                                    fontSize: "24px",
                                    color: "#1890ff",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Historique de déclarations
                                </h1>

                                {/* Contrôles Supérieurs */}
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                                    {/* Sélection du nombre d'entrées */}
                                    <Form.Select
                                        style={{ width: "200px" }}
                                        value={perPage}
                                        onChange={(e) => {
                                            setPerPage(parseInt(e.target.value));
                                                setCurrentPage(1); // Réinitialiser à la première page
                                        }}
                                    >
                                        <option value={5}>5 entrées par page</option>
                                        <option value={10}>10 entrées par page</option>
                                        <option value={15}>15 entrées par page</option>
                                        
                                    </Form.Select>

                                    {/* Recherche */}
                                    <InputGroup style={{ width: "250px" }}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>

                                {/* Table */}
                                <div class="datatable-container table-responsive" >
                                    <table class="table datatable table-sm  datatable-table">
                                        <thead>
                                        <tr>
                                            <th data-sortable="true">
                                            Réf
                                            </th>
                                            <th data-sortable="true">
                                            Salaire Base
                                            </th>
                                            <th data-sortable="true">
                                            Cotisations
                                            </th>
                                            <th data-sortable="true">
                                            Avantages
                                            </th>
                                            <th data-sortable="true">
                                            Personnes à Charge
                                            </th>
                                            <th data-sortable="true">
                                            Année
                                            </th>
                                            <th data-sortable="true">
                                            Mois
                                            </th>
                                            <th data-sortable="true">
                                            IRSA Dû
                                            </th>
                                            <th data-sortable="true">
                                            Pénalité
                                            </th>
                                            <th data-format="YYYY/MM/DD" data-sortable="true" data-type="date">
                                            Date de Dépôt
                                            </th>
                                            <th data-format="YYYY/MM/DD" data-sortable="true" data-type="date">
                                            Fin de paiement
                                            </th>
                                            <th data-sortable="true" class="red">
                                            Action
                                            </th>

                                        </tr>
                                        </thead>
                                        <tbody style={{fontSize:"15px"}}>
                                        {paginatedData.map((declaration, index) => (
                                            <tr data-index={index} key={index}>
                                                <td>{declaration.ref}</td>
                                                <td>{declaration.revenuBase}</td>
                                                <td>{declaration.toutCotis}</td>
                                                <td>{declaration.avantage}</td>
                                                <td>{declaration.personneACharge}</td>
                                                <td>{declaration.anneeDec}</td>
                                                <td>{declaration.moisDec}</td>
                                                <td>{declaration.irsaDu}</td>
                                                <td>{declaration.deductionDep}</td>
                                                <td>{new Date(declaration.dateDepot).toLocaleDateString("fr-FR")}</td>
                                                <td>{calculatePaymentDeadline(declaration.dateDepot)}</td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => rechDec(declaration.ref)}
                                                        style={{
                                                            borderRadius: "5px",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        <FaPrint />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}

                                        {paginatedData.length === 0 && (
                                            <tr>
                                                <td colSpan="12" style={{ textAlign: "center" }}>
                                                    Aucune donnée trouvée
                                                </td>
                                            </tr>
                                        )}

                                        </tbody>
                                    </table>
                                </div>
                            
                                {/* Pagination */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        Affichage {paginatedData.length > 0 ? (currentPage - 1) * perPage + 1 : 0} à{" "}
                                        {currentPage * perPage > filteredData.length ? filteredData.length : currentPage * perPage} sur{" "}
                                        {filteredData.length} entrées
                                    </div>
                                    <Pagination>
                                        <Pagination.Prev
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((prev) => prev - 1)}
                                        />
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <Pagination.Item
                                                key={index + 1}
                                                active={currentPage === index + 1}
                                                onClick={() => setCurrentPage(index + 1)}
                                            >
                                                {index + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                        />
                                    </Pagination>
                                </div>

                            </Container>
                            </Row>
                        </section>
                    </main>
                </Col>

            </Row>
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
                                    <tr>
                                        <td><strong>Date fin de paiement</strong></td>
                                        <td>{calculatePaymentDeadline(formData.dateDepot)}</td>
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
            
        </Container>
        </div>
       
    );
}

export default DeclarationTable;



// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Table, Container, Form, Pagination, InputGroup, Button, Modal, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
// import { FaPrint } from "react-icons/fa";
// import Aside from "../components/Aside";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { QRCodeCanvas } from "qrcode.react";

// function DeclarationTable() {
//     // États pour les déclarations et la pagination
//     const [declarations, setDeclarations] = useState([]);
//     const [error, setError] = useState("");
//     const [search, setSearch] = useState("");
//     const [perPage, setPerPage] = useState(5);
//     const [currentPage, setCurrentPage] = useState(1);

//     // État pour le sidebar
//     const [isSidebarVisible, setSidebarVisible] = useState(true);
//     const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

//     const userId = useMemo(() => localStorage.getItem("userId"), []); // Mémoriser userId

//     useEffect(() => {
//         const fetchDeclarations = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/declarations/${userId}`);
//                 const sanitizedData = response.data.map((row) => ({
//                     ...row,
//                     ref: row.ref ? row.ref.toString() : "", // Assurer que `ref` est une chaîne
//                 }));
//                 setDeclarations(sanitizedData);
//             } catch (err) {
//                 console.error("Erreur lors de la récupération des déclarations :", err);
//                 setError("Erreur lors de la récupération des déclarations.");
//             }
//         };

//         if (userId) {
//             fetchDeclarations(); // Appeler uniquement si l'userId est défini
//         }
//     }, [userId]);

//     // Mémorisation des données filtrées pour éviter des calculs inutiles
//     const filteredData = useMemo(() => {
//         const searchTerm = search.toLowerCase();
//         return declarations.filter((row) => {
//             const columns = [
//                 row.ref ? row.ref.toString().toLowerCase() : "",
//                 row.revenuBase ? row.revenuBase.toString() : "",
//                 row.toutCotis ? row.toutCotis.toString() : "",
//                 row.avantage ? row.avantage.toString() : "",
//                 row.personneACharge ? row.personneACharge.toString() : "",
//                 row.anneeDec ? row.anneeDec.toString() : "",
//                 row.moisDec ? row.moisDec.toLowerCase() : "",
//                 row.irsaDu ? row.irsaDu.toString() : "",
//                 row.deductionDep ? row.deductionDep.toString() : "",
//                 row.dateDepot ? new Date(row.dateDepot).toLocaleDateString("fr-FR").toLowerCase() : "",
//                 row.statut ? row.statut.toLowerCase() : "",
//             ];
//             return columns.some((col) => col.includes(searchTerm));
//         });
//     }, [declarations, search]);

//     const totalPages = useMemo(() => Math.ceil(filteredData.length / perPage), [filteredData, perPage]);
//     const paginatedData = useMemo(() => filteredData.slice((currentPage - 1) * perPage, currentPage * perPage), [filteredData, currentPage, perPage]);

//     const [showModal, setShowModal] = useState(false);
//     const [formData, setFormData] = useState({});

//     // Fonction pour récupérer les informations détaillées d'une déclaration
//     const rechDec = async (refDec) => {
//         try {
//             const response = await axios.get(`http://localhost:5000/declaration/${refDec}`);
//             if (response.data && response.data.length > 0) {
//                 setFormData(response.data[0]); // Assurez-vous de capturer le premier élément du tableau
//             } else {
//                 console.error("Les données reçues sont invalides ou vides.");
//                 setError("Aucune donnée trouvée pour cette déclaration.");
//             }
//             setShowModal(true); // Afficher le modal
//             console.log(response.data);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des informations :", error);
//             setError("Impossible de charger les informations de la déclaration.");
//         }
//         console.log(formData);
//     };

//     const handleDownloadPDF = async () => {
//         const element = document.getElementById("pdf-content");
//         if (!element) return;

//         const canvas = await html2canvas(element, { scale: 2 });
//         const imageData = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//         pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
//         pdf.save("Declaration_IRSA.pdf");
//     };

//     const calculatePaymentDeadline = (declarationDate) => {
//         const declaration = new Date(declarationDate); // Convertit la date de déclaration en objet Date

//         const paymentYear = declaration.getFullYear(); // Année de la déclaration
//         const paymentMonth = declaration.getMonth() + 2; // Mois suivant (+1 pour indexation, +1 pour le mois suivant)

//         const paymentDeadline = new Date(paymentYear, paymentMonth - 1, 15); // Date au 15 du mois suivant

//         return paymentDeadline.toLocaleDateString("fr-FR"); // Formate la date au format français
//     };

//     if (error) {
//         return <p style={{ color: "red" }}>{error}</p>;
//     }

//     return (
//         <div
//             style={{
//                 backgroundColor: "rgb(245, 245, 250)", // Bright background
//                 minHeight: "100vh", // Ensure full viewport height
//             }}
//         >
//             <Container fluid>
//                 <Row className="h-100">
//                     {/* Sidebar (Aside) */}
//                     {isSidebarVisible && (
//                         <Col md={2} className="p-0 bg-light sidebar">
//                             <Aside />
//                         </Col>
//                     )}

//                     {/* Main Content */}
//                     <Col md={isSidebarVisible ? 10 : 12} className="p-4 main-content">
//                         <main id="main" className="main" style={{ padding: "30px" }}>
//                             <section className="section">
//                                 <Row>
//                                     <Col>
//                                         <div
//                                             style={{
//                                                 backgroundColor: "white", // White card background for contrast
//                                                 padding: "30px",
//                                                 borderRadius: "8px",
//                                                 boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                                             }}
//                                         >
//                                             <div className="d-flex justify-content-between align-items-center mb-4">
//                                                 <Button
//                                                     variant="primary"
//                                                     onClick={toggleSidebar}
//                                                     style={{ borderRadius: "30px" }}
//                                                 >
//                                                     <i
//                                                         className={isSidebarVisible ? "bi bi-arrow-left" : "bi bi-arrow-right"}
//                                                         style={{ fontSize: "1.5rem" }}
//                                                     ></i>
//                                                 </Button>
//                                                 <h1
//                                                     className="text-end"
//                                                     style={{
//                                                         fontSize: "24px",
//                                                         color: "#1890ff",
//                                                         fontWeight: "bold",
//                                                         marginBottom: "0",
//                                                     }}
//                                                 >
//                                                     Historique de déclarations
//                                                 </h1>
//                                             </div>

//                                             {/* Contrôles Supérieurs */}
//                                             <div className="d-flex justify-content-between mb-3">
//                                                 {/* Sélection du nombre d'entrées */}
//                                                 <Form.Select
//                                                     style={{ width: "200px" }}
//                                                     value={perPage}
//                                                     onChange={(e) => {
//                                                         setPerPage(parseInt(e.target.value));
//                                                         setCurrentPage(1); // Réinitialiser à la première page
//                                                     }}
//                                                 >
//                                                     <option value={5}>5 entrées par page</option>
//                                                     <option value={10}>10 entrées par page</option>
//                                                     <option value={15}>15 entrées par page</option>
//                                                 </Form.Select>

//                                                 {/* Recherche */}
//                                                 <InputGroup style={{ width: "250px" }}>
//                                                     <Form.Control
//                                                         type="text"
//                                                         placeholder="Rechercher..."
//                                                         value={search}
//                                                         onChange={(e) => setSearch(e.target.value)}
//                                                     />
//                                                 </InputGroup>
//                                             </div>

//                                             {/* Table */}
//                                             <div className="datatable-container table-responsive">
//                                                 <Table striped bordered hover className="datatable table-sm datatable-table">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>Réf</th>
//                                                             <th>Salaire Base</th>
//                                                             <th>Cotisations</th>
//                                                             <th>Avantages</th>
//                                                             <th>Personnes à Charge</th>
//                                                             <th>Année</th>
//                                                             <th>Mois</th>
//                                                             <th>IRSA Dû</th>
//                                                             <th>Pénalité</th>
//                                                             <th>Date de Dépôt</th>
//                                                             <th>Fin de paiement</th>
//                                                             <th className="text-center">Action</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody style={{ fontSize: "15px" }}>
//                                                         {paginatedData.map((declaration, index) => (
//                                                             <tr key={index}>
//                                                                 <td>{declaration.ref}</td>
//                                                                 <td>{declaration.revenuBase}</td>
//                                                                 <td>{declaration.toutCotis}</td>
//                                                                 <td>{declaration.avantage}</td>
//                                                                 <td>{declaration.personneACharge}</td>
//                                                                 <td>{declaration.anneeDec}</td>
//                                                                 <td>{declaration.moisDec}</td>
//                                                                 <td>{declaration.irsaDu}</td>
//                                                                 <td>{declaration.deductionDep}</td>
//                                                                 <td>{new Date(declaration.dateDepot).toLocaleDateString("fr-FR")}</td>
//                                                                 <td>{calculatePaymentDeadline(declaration.dateDepot)}</td>
//                                                                 <td className="text-center">
//                                                                     <Button
//                                                                         variant="outline-primary"
//                                                                         size="sm"
//                                                                         onClick={() => rechDec(declaration.ref)}
//                                                                         style={{ borderRadius: "5px", fontWeight: "600" }}
//                                                                     >
//                                                                         <FaPrint />
//                                                                     </Button>
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                         {paginatedData.length === 0 && (
//                                                             <tr>
//                                                                 <td colSpan="12" className="text-center">
//                                                                     Aucune donnée trouvée
//                                                                 </td>
//                                                             </tr>
//                                                         )}
//                                                     </tbody>
//                                                 </Table>
//                                             </div>

//                                             {/* Pagination */}
//                                             <div className="d-flex justify-content-between align-items-center mt-3">
//                                                 <div>
//                                                     Affichage {paginatedData.length > 0 ? (currentPage - 1) * perPage + 1 : 0} à{" "}
//                                                     {currentPage * perPage > filteredData.length ? filteredData.length : currentPage * perPage} sur{" "}
//                                                     {filteredData.length} entrées
//                                                 </div>
//                                                 <Pagination>
//                                                     <Pagination.Prev
//                                                         disabled={currentPage === 1}
//                                                         onClick={() => setCurrentPage((prev) => prev - 1)}
//                                                     />
//                                                     {Array.from({ length: totalPages }).map((_, index) => (
//                                                         <Pagination.Item
//                                                             key={index + 1}
//                                                             active={currentPage === index + 1}
//                                                             onClick={() => setCurrentPage(index + 1)}
//                                                         >
//                                                             {index + 1}
//                                                         </Pagination.Item>
//                                                     ))}
//                                                     <Pagination.Next
//                                                         disabled={currentPage === totalPages}
//                                                         onClick={() => setCurrentPage((prev) => prev + 1)}
//                                                     />
//                                                 </Pagination>
//                                             </div>
//                                         </div>
//                                     </Col>
//                                 </Row>
//                             </section>
//                         </main>
//                     </Col>
//                 </Row>

//                 {/* Modal d'affichage des détails de la déclaration */}
//                 <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} centered>
//                     <Modal.Header closeButton>
//                         <Modal.Title>Détails de la Déclaration</Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body id="pdf-content">
//                         <Container style={{ backgroundColor: "white", padding: "20px" }}>
//                             <div className="border bg-light p-4">
//                                 <img src="Logo_dgi_2024.png" alt="logoDGI" style={{ float: "right", width: "130px", height: "100px", position: "absolute", top: "20px", right: "20px" }}></img>
//                                 <h5 className="text-center">République de Madagascar</h5>
//                                 <h5 className="text-center">DIRECTION GENERALE DES IMPOTS</h5>
//                                 <h4 className="text-center mt-3">Accusé de Déclaration IRSA</h4>
//                                 <hr />
//                                 {/* QR Code généré */}
//                                 {formData.ref && (
//                                     <div style={{ float: "right", marginBottom: "10px" }}>
//                                         <OverlayTrigger
//                                             placement="bottom"
//                                             overlay={
//                                                 <Tooltip>
//                                                     NIF : {formData.nif} <br />
//                                                     Nom : {formData.nom} <br />
//                                                     Période : {formData.moisDec}-{formData.anneeDec}<br />
//                                                     Revenu Déclaré : {formData.revenuBase}<br />
//                                                     IRSA : {formData.irsaDu}<br />
//                                                     Date Soumission : {new Date(formData.dateDepot).toLocaleDateString("fr-FR")}
//                                                 </Tooltip>
//                                             }
//                                         >
//                                             <div>
//                                                 <QRCodeCanvas
//                                                     value={
//                                                         "nif:" + formData.nif + "\n" +
//                                                         "nom:" + formData.nom + "\n" +
//                                                         "periode:" + formData.moisDec + "-" + formData.anneeDec + "\n" +
//                                                         "revenuDéclare:" + formData.revenuBase + "\n" +
//                                                         "IRSA:" + formData.irsaDu + "\n" +
//                                                         "dateSoumission:" + new Date(formData.dateDepot).toLocaleDateString("fr-FR")
//                                                     }
//                                                     size={140}
//                                                     bgColor={"#ffffff"}
//                                                     fgColor={"#000000"}
//                                                     level={"H"}
//                                                 />
//                                             </div>
//                                         </OverlayTrigger>
//                                     </div>
//                                 )}

//                                 <p className="text-start mt-1">
//                                     <strong>NIF :</strong> {formData.nif}
//                                 </p>
//                                 <p className="text-start mt-1">
//                                     <strong>Nom :</strong> {formData.nom} {formData.prenom}
//                                 </p>
//                                 <p className="text-start mt-1">
//                                     <strong>Fonction :</strong> {formData.fonction}
//                                 </p>
//                                 <p className="text-start mt-1">
//                                     <strong>Adresse email :</strong> {formData.email}
//                                 </p>

//                                 <hr />
//                                 <Table bordered>
//                                     <tbody>
//                                         <tr>
//                                             <td><strong>Référence Déclaration</strong></td>
//                                             <td>{formData.ref}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Salaire de Base</strong></td>
//                                             <td>{formData.revenuBase} Ar</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Total Cotisations</strong></td>
//                                             <td>{formData.toutCotis} Ar</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Avantages</strong></td>
//                                             <td>{formData.avantage} Ar</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Personnes à Charge</strong></td>
//                                             <td>{formData.personneACharge}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Année</strong></td>
//                                             <td>{formData.anneeDec}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Mois</strong></td>
//                                             <td>{formData.moisDec}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>IRSA Dû</strong></td>
//                                             <td>{formData.irsaDu} Ar</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Pénalités</strong></td>
//                                             <td>{formData.deductionDep} Ar</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Date de Dépôt</strong></td>
//                                             <td>{new Date(formData.dateDepot).toLocaleDateString("fr-FR")}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Statut</strong></td>
//                                             <td>{formData.statut}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Date fin de paiement</strong></td>
//                                             <td>{calculatePaymentDeadline(formData.dateDepot)}</td>
//                                         </tr>
//                                     </tbody>
//                                 </Table>


//                                 <p className="text-end mt-5">
//                                     <em>Fianarantsoa, le {new Date().toLocaleDateString("fr-MG")}</em>
//                                 </p>
//                                 <p className="text-end">
//                                     <strong>Signature :</strong> ____________________________
//                                 </p>
//                             </div>

//                         </Container>

//                     </Modal.Body>
//                     <Modal.Footer>
//                         <Button variant="secondary" onClick={() => setShowModal(false)}>
//                             Fermer
//                         </Button>
//                         <Button variant="success" onClick={handleDownloadPDF}>
//                             Télécharger le PDF
//                         </Button>
//                     </Modal.Footer>
//                 </Modal>

//             </Container>
//         </div>

//     );
// }

// export default DeclarationTable;