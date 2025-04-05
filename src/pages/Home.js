import React from "react";
import { Container, Row, Col, Button, Card, Carousel } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom"; // Importez Link pour la navigation interne

// Styles pour la section principale (Carousel)
const HeroSection = styled(Carousel)`
  /* Pas besoin de styles spécifiques ici, on stylera les items */
`;

const HeroItem = styled(Carousel.Item)`
  position: relative;
  height: 500px;
  overflow: hidden; /* Empêche l'image de dépasser */
`;

const HeroBackground = styled.div`
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Ajout d'un overlay sombre pour améliorer la lisibilité du texte */
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Ajustez l'opacité selon vos préférences */
  }
`;

const HeroContent = styled(Container)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 10; /* Assure que le contenu est au-dessus de l'overlay */
`;

const HeroTitle = styled.h1`
  font-weight: bold;
  font-size: 2.5rem; /* Ajustez la taille */
  margin-bottom: 1rem;
  color: white;
  span {
    color: #fdd835; /* Couleur jaune pour "déclarations" (exemple) */
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;
const HeroButton = styled(Button)`
  font-weight: bold;
  color: #1a202c; /* Couleur de texte sombre */
  background-color: #fdd835; /* Couleur jaune vive */
  border: none;
    padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 5px;
  text-decoration : none;
  &:hover {
    background-color: #fbc02d; /* Assombrir légèrement au survol */
    color: #1a202c;
  }
    

`;

// Styles pour la section "Pourquoi choisir notre service ?"
const WhyChooseSection = styled(Container)`
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: #f8f9fa; /* Un fond légèrement gris pour la section */
`;

const WhyChooseTitle = styled.h2`
  text-align: center;
  margin-bottom: 4rem;
  color: #1a202c;
  font-weight: bold;
  font-size: 2.2rem;
`;

const WhyChooseCard = styled(Card)`
  border: none;
  background-color: transparent;
  text-align: center;
  padding: 1.5rem;
`;

const WhyChooseIcon = styled.div`
  font-size: 3rem;
  color: #3498db; /* Couleur d'accent pour les icônes */
  margin-bottom: 1rem;
`;

const WhyChooseCardTitle = styled(Card.Title)`
  color: #1a202c;
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const WhyChooseCardText = styled(Card.Text)`
  color: #4a5568;
`;

// Styles pour la section "Témoignages" (Optionnel)
const TestimonialsSection = styled(Container)`
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: #e9ecef; /* Un autre fond gris clair */
`;

const TestimonialsTitle = styled.h2`
  text-align: center;
  margin-bottom: 4rem;
  color: #1a202c;
  font-weight: bold;
  font-size: 2.2rem;
`;

const TestimonialCard = styled(Card)`
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const TestimonialQuote = styled.p`
  font-style: italic;
  color: #333;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.p`
  text-align: right;
  color: #777;
  font-size: 0.9rem;
`;

// Styles pour la section "Appel à l'action"
const CallToActionSection = styled(Container)`
  padding-top: 5rem;
  padding-bottom: 5rem;
  background-color: #2c3e50; /* Fond sombre pour l'appel à l'action */
  color: white;
  text-align: center;
`;

const CallToActionTitle = styled.h2`
  font-weight: bold;
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const CallToActionText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const CallToActionLink = styled(Link)`
  text-decoration: none;
`;

const CallToActionBtn = styled(Button)`
  background-color: #fdd835;
  color: #1a202c;
  font-weight: bold;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 5px;
  &:hover {
    background-color: #fbc02d;
  }
`;

// Styles pour la section des fonctionnalités
const FeaturesSection = styled(Container)`
  padding-top: 4rem;
  padding-bottom: 4rem;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  margin-bottom: 3rem;
  color: #1a202c;
  font-weight: bold;
  font-size: 2rem;
`;

const FeatureCard = styled(Card)`
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureCardImage = styled(Card.Img)`
  height: 200px;
  object-fit: cover; /* Empêche la déformation de l'image */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const FeatureCardBody = styled(Card.Body)`
  height: 180px; /* Ajustez la hauteur selon le contenu */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Espacement entre le titre et le texte */
`;

const FeatureCardTitle = styled(Card.Title)`
  color: #1a202c;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
`;

const FeatureCardText = styled(Card.Text)`
  font-size: 1rem;
  color: #4a5568;
`;


function Home() {
  return (
    <div>
      {/* Section principale avec carrousel */}
      <HeroSection controls={false} indicators>
        <HeroItem>
          <HeroBackground imageUrl="Blog_Paytm_What-is-Tax_-Types-of-Tax-Benefits-and-Penalty-in-Tax-1.jpg" />
          <HeroContent>
            <HeroTitle>Simplifiez votre déclaration d'IRSA à Madagascar</HeroTitle>
            <HeroSubtitle>Une plateforme intuitive pour gérer vos impôts en ligne.</HeroSubtitle>
            <HeroButton as={Link} to="/declaration">
              Commencer ma déclaration
            </HeroButton>
          </HeroContent>
        </HeroItem>
        <HeroItem>
          <HeroBackground imageUrl="GettyImages-959142068-how-to-find-best-tax-preparer-near-1440x864.jpg" />
          <HeroContent>
            <HeroTitle>
              Suivez l'historique de vos <span>déclarations</span> fiscales
            </HeroTitle>
            <HeroSubtitle>Accédez à vos anciennes déclarations et restez en conformité.</HeroSubtitle>
            <HeroButton as={Link} to="/historique">
              Voir mon historique
            </HeroButton>
          </HeroContent>
        </HeroItem>
      </HeroSection>

      {/* Section "Pourquoi choisir notre service ?" */}
      <WhyChooseSection>
        <WhyChooseTitle>Pourquoi choisir notre service ?</WhyChooseTitle>
        <Row className="gy-4">
          <Col md={4}>
            <WhyChooseCard>
              <WhyChooseIcon>
                <i className="bi bi-clock-fill"></i> {/* Exemple d'icône Bootstrap Icons */}
              </WhyChooseIcon>
              <WhyChooseCardTitle>Gain de temps</WhyChooseCardTitle>
              <WhyChooseCardText>
                Déclarez vos impôts rapidement et efficacement, sans les tracas administratifs.
              </WhyChooseCardText>
            </WhyChooseCard>
          </Col>
          <Col md={4}>
            <WhyChooseCard>
              <WhyChooseIcon>
                <i className="bi bi-shield-fill-check"></i>
              </WhyChooseIcon>
              <WhyChooseCardTitle>Sécurité et confidentialité</WhyChooseCardTitle>
              <WhyChooseCardText>
                Vos informations sont protégées avec les meilleures pratiques de sécurité.
              </WhyChooseCardText>
            </WhyChooseCard>
          </Col>
          <Col md={4}>
            <WhyChooseCard>
              <WhyChooseIcon>
                <i className="bi bi-file-earmark-check-fill"></i>
              </WhyChooseIcon>
              <WhyChooseCardTitle>Conformité garantie</WhyChooseCardTitle>
              <WhyChooseCardText>
                Restez à jour avec les dernières réglementations fiscales à Madagascar.
              </WhyChooseCardText>
            </WhyChooseCard>
          </Col>
        </Row>
      </WhyChooseSection>

      {/* Section fonctionnalités */}
      <FeaturesSection>
        <FeaturesTitle>Fonctionnalités clés</FeaturesTitle>
        <Row className="gy-4">
          <Col md={4}>
            <FeatureCard>
              <FeatureCardImage
                variant="top"
                src="Difference-Between-Direct-And-Indirect-Tax-compressed.jpg"
                alt="Déclarations simplifiées"
              />
              <FeatureCardBody>
                <FeatureCardTitle>Déclarations simplifiées</FeatureCardTitle>
                <FeatureCardText>
                  Interface intuitive pour remplir et soumettre facilement vos informations fiscales.
                </FeatureCardText>
              </FeatureCardBody>
            </FeatureCard>
          </Col>
          <Col md={4}>
            <FeatureCard>
              <FeatureCardImage
                variant="top"
                src="budget-planning-vector-illustration-flat-600nw-2149455979.webp"
                alt="Historique des déclarations"
              />
              <FeatureCardBody>
                <FeatureCardTitle>Historique des déclarations</FeatureCardTitle>
                <FeatureCardText>
                  Accédez à un aperçu complet de vos déclarations passées et de leur statut.
                </FeatureCardText>
              </FeatureCardBody>
            </FeatureCard>
          </Col>
          <Col md={4}>
            <FeatureCard>
              <FeatureCardImage
                variant="top"
                src="CloudCF-Blog-Tax-Accounting-101.png"
                alt="Accusés de réception"
              />
              <FeatureCardBody>
                <FeatureCardTitle>Accusés de réception</FeatureCardTitle>
                <FeatureCardText>
                  Téléchargez instantanément vos accusés de réception après chaque soumission.
                </FeatureCardText>
              </FeatureCardBody>
            </FeatureCard>
          </Col>
        </Row>
      </FeaturesSection>

      {/* Section Appel à l'action */}
      <CallToActionSection>
        <CallToActionTitle>Prêt à simplifier votre déclaration d'IRSA ?</CallToActionTitle>
        <CallToActionText>
          Rejoignez notre plateforme dès aujourd'hui et découvrez une manière plus facile de gérer vos impôts.
        </CallToActionText>
        <CallToActionLink to="/declaration">
          <CallToActionBtn>Démarrez votre déclaration</CallToActionBtn>
        </CallToActionLink>
      </CallToActionSection>

      {/* Vous pourriez ajouter une section "Témoignages" ici si vous en avez */}
      {/* <TestimonialsSection>
        <TestimonialsTitle>Ce que nos utilisateurs disent</TestimonialsTitle>
        <Row>
          <Col md={6}>
            <TestimonialCard>
              <TestimonialQuote>
                "L'interface est très intuitive et j'ai pu faire ma déclaration en quelques minutes seulement !"
              </TestimonialQuote>
              <TestimonialAuthor>- Jean D.</TestimonialAuthor>
            </TestimonialCard>
          </Col>
          <Col md={6}>
            <TestimonialCard>
              <TestimonialQuote>
                "Le service client est excellent et m'a aidé à répondre à toutes mes questions."
              </TestimonialQuote>
              <TestimonialAuthor>- Marie L.</TestimonialAuthor>
            </TestimonialCard>
          </Col>
        </Row>
      </TestimonialsSection> */}
    </div>
  );
}

export default Home;