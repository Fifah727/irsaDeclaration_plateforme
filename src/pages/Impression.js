import React, { useRef } from "react";
import { Container, Button, Table } from "react-bootstrap";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Impression() {
    const declaration = {
        refDec: "DEC001",
        idU: "U123",
        salaireBase: 1500000,
        toutCotis: 100000,
        avantage: 200000,
        personneCharge: 2,
        anneeDec: 2025,
        moisDec: "Mars",
        irsaDu: 50000,
        penalite: 0,
        dateDepot: "2025-03-15",
        statutDep: "Soumis",
    };

    // Référence pour le contenu capturable
    const componentRef = useRef();

    // Fonction pour générer le PDF
    const handleDownloadPDF = async () => {
        if (componentRef.current) {
            const canvas = await html2canvas(componentRef.current, { scale: 2 }); // Capture l'élément avec une résolution élevée
            const imageData = canvas.toDataURL("image/png"); // Convertit en image PNG
            const pdf = new jsPDF("p", "mm", "a4"); // Configure le PDF en orientation portrait, format A4
            const imgProps = pdf.getImageProperties(imageData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight); // Ajoute l'image au PDF
            pdf.save(`Declaration_IRSA_${declaration.refDec}.pdf`); // Sauvegarde le fichier PDF
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
        <Container style={{
                    // maxWidth: "1100px",
                    backgroundColor: "white", // White card background for contrast
                    padding: "50px",
        }}>
            {/* Contenu capturable */}
            <div ref={componentRef} className="border bg-light p-4">
            <img src="Logo_dgi_2024.png" alt="logoDGI" style={{float:"right",width:"130px",height:"100px",position:"absolute"}}></img>
                <h5 className="text-center">République de Madagascar</h5>
                <h5 className="text-center">DIRECTION GENERALE DES IMPOTS</h5>
                <h4 className="text-center mt-3">Accusé de Déclaration IRSA</h4>
                
                <hr />
                <Table bordered>
                    <tbody>
                        <tr>
                            <td><strong>Référence Déclaration</strong></td>
                            <td>{declaration.refDec}</td>
                        </tr>
                        <tr>
                            <td><strong>ID Utilisateur</strong></td>
                            <td>{declaration.idU}</td>
                        </tr>
                        <tr>
                            <td><strong>Salaire de Base</strong></td>
                            <td>{declaration.salaireBase.toLocaleString("fr-MG")} MGA</td>
                        </tr>
                        <tr>
                            <td><strong>Total Cotisations</strong></td>
                            <td>{declaration.toutCotis.toLocaleString("fr-MG")} MGA</td>
                        </tr>
                        <tr>
                            <td><strong>Avantages</strong></td>
                            <td>{declaration.avantage.toLocaleString("fr-MG")} MGA</td>
                        </tr>
                        <tr>
                            <td><strong>Personnes à Charge</strong></td>
                            <td>{declaration.personneCharge}</td>
                        </tr>
                        <tr>
                            <td><strong>Année</strong></td>
                            <td>{declaration.anneeDec}</td>
                        </tr>
                        <tr>
                            <td><strong>Mois</strong></td>
                            <td>{declaration.moisDec}</td>
                        </tr>
                        <tr>
                            <td><strong>IRSA Dû</strong></td>
                            <td>{declaration.irsaDu.toLocaleString("fr-MG")} MGA</td>
                        </tr>
                        <tr>
                            <td><strong>Pénalités</strong></td>
                            <td>{declaration.penalite.toLocaleString("fr-MG")} MGA</td>
                        </tr>
                        <tr>
                            <td><strong>Date de Dépôt</strong></td>
                            <td>{declaration.dateDepot}</td>
                        </tr>
                        <tr>
                            <td><strong>Statut</strong></td>
                            <td>{declaration.statutDep}</td>
                        </tr>
                    </tbody>
                </Table>
                <p className="text-end mt-5">
                    <em>Antananarivo, le {new Date().toLocaleDateString("fr-MG")}</em>
                </p>
                <p className="text-end">
                    <strong>Signature :</strong> ____________________________
                </p>
            </div>

            {/* Bouton pour PDF */}
            <div className="text-center mt-4">
                <Button variant="primary" onClick={handleDownloadPDF}>
                    Télécharger en PDF
                </Button>
            </div>
        </Container>
        </div>
    );
}

export default Impression;

// import React from "react";
// import { Alert, Container } from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css'; // Assurez-vous d'importer Bootstrap

// const Impression = () => {
//   return (
//     <Container className="mt-4">
//       <h1>Bienvenue dans React-Bootstrap</h1>

//       {/* Messages avec différentes variantes */}
//       <Alert variant="success">
//         Ceci est un message de succès ! 🎉
//       </Alert>
//       <Alert variant="danger">
//         Attention : une erreur s'est produite ! ❌
//       </Alert>
//       <Alert variant="info">
//         Ceci est un message informatif. ℹ️
//       </Alert>
//     </Container>
//   );
// };

// export default Impression;

