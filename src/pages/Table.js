import React, { useState } from "react";
import { Modal, Button, ProgressBar, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function DeclarationModal() {
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleShowProgressModal = () => {
    setShowProgressModal(true);
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowProgressModal(false);
          setShowConfirmationModal(true); // Affiche le 2e modal après la progression
        }
        return prev + 10;
      });
    }, 200); // Avance la barre toutes les 200ms
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setProgress(0); // Réinitialise la barre
  };

  const handleContinue = () => {
    alert("Merci, vous continuez avec ou sans l'option email.");
    handleCloseConfirmationModal(); // Ferme le modal de confirmation
  };

  return (
    <div className="text-center mt-5">
      {/* Bouton principal */}
      <Button
        variant="success"
        className="btn-lg shadow"
        onClick={handleShowProgressModal}
        style={{
          padding: "10px 20px",
          background: "#28a745",
          border: "none",
          textTransform: "uppercase",
        }}
      >
        <i className="bi bi-check-circle-fill"></i> Valider
      </Button>

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
        keyboard={false}  // Désactive la fermeture via la touche Escape
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

      {/* Styles supplémentaires */}
      <style>
        {`
          .modal-style .modal-content,
          .progress-modal-style .modal-content {
            border: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideDown 0.5s ease-out;
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default DeclarationModal;
