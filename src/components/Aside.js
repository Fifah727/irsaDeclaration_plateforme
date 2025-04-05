import React from "react";
import { Nav } from "react-bootstrap";
import styled from "styled-components";
import { Link } from 'react-router-dom'; // Si vous utilisez React Router

// Style pour le conteneur de la navigation latérale
const SidebarNav = styled(Nav)`
  flex-column;
  padding: 1rem;
  background-color: #1a202c;
  height: 107%;
  box-shadow: 5px 0px 8px rgba(0, 0, 0, 0.2);
  border-right: 2px solid #2d3748;
  display: flex; /* Ajout de flex */
  flex-direction: column; /* Assure la disposition verticale */
  gap: 0.25rem; /* Utilise la propriété gap pour l'espacement */
`;

// Style pour chaque élément de navigation (Nav.Item)
const SidebarItem = styled(Nav.Item)`
  
`;

// Style pour les liens de navigation (Nav.Link)
const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #e2e8f0; /* Gris clair */
  padding: 0.75rem 1rem; /* Ajuste le padding pour un aspect plus moderne */
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2d3748; /* Légèrement plus clair au survol */
    color: #4cbaceff; /* Bleu clair (accent) au survol */
  }

  i {
    font-size: 1.5rem;
    margin-right: 0.75rem; /* Ajuste la marge pour l'icône */
    color: #4cbaceff; /* Couleur de l'icône */
  }

  span {
    flex-grow: 1; /* Permet au texte de s'étendre */
  }
`;

function Aside() {
  return (
    <SidebarNav className="sidebar-nav">
      {/* Liste des Déclarations */}
      <SidebarItem>
        <SidebarLink to="/historique">
          <i className="bi bi-grid"></i>
          <span>Déclarations</span>
        </SidebarLink>
      </SidebarItem>

      {/* Calendrier Fiscal */}
      <SidebarItem>
        <SidebarLink to="/calendrier">
          <i className="bi bi-calendar"></i>
          <span>Calendrier</span>
        </SidebarLink>
      </SidebarItem>

      {/* Stats Fiscal */}
      <SidebarItem>
        <SidebarLink to="/chart">
          <i className="bi bi-bar-chart"></i>
          <span>Statistiques</span>
        </SidebarLink>
      </SidebarItem>
    </SidebarNav>
  );
}

export default Aside;