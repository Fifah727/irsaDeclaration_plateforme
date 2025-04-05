import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
  font-family: sans-serif;
`;

const Title = styled.h1`
  font-size: 4em;
  color: #e74c3c;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 1.5em;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const Suggestion = styled.p`
  font-size: 1em;
  color: #777;
`;

const HomeLink = styled.a`
  color: #3498db;
  text-decoration: none;
`;

const Notfound = () => {
  return (
    <Container>
      <Title>404</Title>
      <Message>Oops! La page que vous recherchez est introuvable.</Message>
      <Suggestion>Veuillez vérifier l'URL ou retourner à la <HomeLink href="/">page d'accueil</HomeLink>.</Suggestion>
    </Container>
  );
};

export default Notfound;