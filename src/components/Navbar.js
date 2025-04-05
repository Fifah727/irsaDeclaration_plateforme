import React, { useState,useEffect } from "react";
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components"; // Importez styled-components

const StyledNavbar = styled(Navbar)`
  background-color: #1a202c;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const StyledNavbarBrand = styled(Navbar.Brand)`
  margin-right: auto; /* Pousse les liens de navigation vers la droite */
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  font-family: "'Roboto', sans-serif";
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #cbd5e0; /* Couleur au survol */
  }
`;

const StyledNavLinkContainer = styled(Nav.Item)`
  margin-right: 15px;
`;

const StyledNavLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => (props.isActive ? "#E2E8F0" : "white")};
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #cbd5e0; /* Couleur au survol */
  }
`;

const StyledDropdown = styled(Dropdown)`
  margin-left: auto; /* Pousse le dropdown vers la droite si nécessaire */
`;

const StyledDropdownToggle = styled(Dropdown.Toggle)`
  background: none !important;
  border: none !important;
  padding: 0 !important;
  &:hover {
    background: none !important;
  }
  &:focus {
    box-shadow: none !important;
  }
  &:after {
    border: none !important; /* Supprime la flèche par défaut */
  }
`;

const StyledProfileImage = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
`;

const StyledProfileName = styled.span`
  display: none;
  @media (min-width: 768px) {
    display: inline-block;
    margin-left: 8px;
  }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const StyledDropdownHeader = styled(Dropdown.Header)`
  background-color: #f8f9fa;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  color: #495057;
  &:h6 {
    margin-bottom: 0.2rem;
    font-weight: bold;
  }
  &:small {
    color: #6c757d;
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  display: flex;
  align-items: center;
  color: #333;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #f0f0f0;
  }
  i {
    margin-right: 0.75rem;
  }
`;

const StyledDropdownDivider = styled(Dropdown.Divider)`
  border-top: 1px solid #e0e0e0;
`;
function NavigationBar() {
    const location = useLocation();
  
    const getActiveClass = (path) => (location.pathname === path ? "active-link" : "");
  
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imageSrc, setImageSrc] = useState("default.jpg");
    const [formData, setFormData] = useState({
      idDir: "",
      fonction: "",
      nom: "",
      prenom: "",
      cin: "",
      nif: "",
      mdp: "",
      email: "",
    });
    const userId = localStorage.getItem("userId");
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/users/${userId}`);
          setFormData(response.data);
          if (response.data.cin >= 4) {
            const fourthDigit = response.data.cin[3];
            if (fourthDigit === "1") {
              setImageSrc("woman.jpg");
            } else if (fourthDigit === "0") {
              setImageSrc("man.jpg");
            } else {
              setImageSrc("pasImage.png");
            }
          } else {
            setImageSrc("pasImage.png");
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
  
    return (
      <StyledNavbar variant="dark" expand="lg">
        <Container>
          <StyledNavbarBrand>
            <StyledLink to="/">IRSA Declaration</StyledLink>
          </StyledNavbarBrand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <StyledNavLinkContainer>
                <StyledNavLink
                  to="/declaration"
                  isActive={location.pathname === "/declaration"}
                >
                  Déclaration
                </StyledNavLink>
              </StyledNavLinkContainer>
              <StyledNavLinkContainer>
                <StyledNavLink
                  to="/historique"
                  isActive={location.pathname === "/historique"}
                >
                  Suivi fiscal
                </StyledNavLink>
              </StyledNavLinkContainer>
  
              <StyledDropdown align="end" className="nav-item dropdown pe-3">
                <StyledDropdownToggle
                  variant="link"
                  id="dropdown-basic"
                  className="nav-link nav-profile d-flex align-items-center pe-0"
                >
                  <StyledProfileImage
                    src={imageSrc}
                    alt="Profile"
                    className="rounded-circle"
                  />
                  <StyledProfileName>
                    {formData.nom} {formData.prenom}
                  </StyledProfileName>
                </StyledDropdownToggle>
  
                <StyledDropdownMenu className="dropdown-menu-end dropdown-menu-arrow profile">
                  <StyledDropdownHeader>
                    <h6>{formData.nom} {formData.prenom}</h6>
                    <small>{formData.fonction}</small>
                  </StyledDropdownHeader>
                  <StyledDropdownDivider />
  
                  <StyledDropdownItem href="/profil" className="d-flex align-items-center">
                    <i className="bi bi-person me-2"></i>
                    Mon profil
                  </StyledDropdownItem>
                  <StyledDropdownDivider />
  
                  <StyledDropdownItem href="/login" className="d-flex align-items-center">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Se déconnecter
                  </StyledDropdownItem>
                </StyledDropdownMenu>
              </StyledDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>
    );
  }
  
  export default NavigationBar;