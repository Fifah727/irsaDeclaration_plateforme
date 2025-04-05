import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { Link } from 'react-router-dom'; // Si vous utilisez React Router pour la navigation

// Styles pour le conteneur principal du footer
const FooterContainer = styled.footer`
  background-color: #1a202c; /* Bleu foncé */
  color: #f9fafb; /* Blanc cassé */
  padding: 50px 0;
  font-family: "Arial", sans-serif;
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.2);
`;

// Style pour les titres des sections du footer
const FooterTitle = styled.h5`
  font-weight: bold;
  color: #4cbaceff; /* Bleu clair (accent) */
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
`;

// Style pour le texte général du footer
const FooterText = styled.p`
  font-size: 0.9rem;
  line-height: 1.8;
  color: #e2e8f0; /* Gris clair */
`;

// Style pour les liens de navigation
const FooterLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
  &:hover {
    color: #4cbaceff; /* Bleu clair au survol */
    text-decoration: underline;
  }
`;

// Style pour les liens de contact (emails, etc.)
const ContactLink = styled.a`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
  &:hover {
    color: #4cbaceff; /* Bleu clair au survol */
    text-decoration: underline;
  }
`;

// Style pour le texte de copyright
const CopyrightText = styled.small`
  font-size: 0.8rem;
  font-weight: 500;
  color: #e2e8f0;
  display: block;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

function Footer() {
  return (
    <FooterContainer>
      <Container>
        <Row className="pb-4 text-center text-md-start">
          {/* Colonne 1 : À propos */}
          <Col md={4} className="mb-3">
            <FooterTitle>À propos</FooterTitle>
            <FooterText>
              Bienvenue sur <strong>IRSA Declaration</strong>, votre plateforme idéale pour simplifier vos déclarations fiscales. Nous sommes là pour rendre vos démarches plus simples et efficaces.
            </FooterText>
          </Col>

          {/* Colonne 2 : Navigation */}
          <Col md={4} className="mb-3">
            <FooterTitle>Navigation</FooterTitle>
            <ul className="list-unstyled">
              <li>
                <FooterLink to="/">Accueil</FooterLink>
              </li>
              <li>
                <FooterLink to="/declaration">Déclaration</FooterLink>
              </li>
              <li>
                <FooterLink to="/historique">Historique</FooterLink>
              </li>
              <li>
                <FooterLink to="/login">Quitter</FooterLink>
              </li>
            </ul>
          </Col>

          {/* Colonne 3 : Contact */}
          <Col md={4} className="mb-3">
            <FooterTitle>Contact</FooterTitle>
            <FooterText>
              Email : <ContactLink href="mailto:ssarobidyfifaliana@gmail.com">ssarobidyfifaliana@gmail.com</ContactLink>
            </FooterText>
            <FooterText>Téléphone : 0322471287</FooterText>
            <FooterText>Adresse : Fianarantsoa, Madagascar</FooterText>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <CopyrightText>
              &copy; {new Date().getFullYear()} IRSA Declaration. Tous droits réservés.
            </CopyrightText>
          </Col>
        </Row>
      </Container>
    </FooterContainer>
  );
}

export default Footer;