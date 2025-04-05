const { Client } = require("pg");

// Configuration de la connexion PostgreSQL
const client = new Client({
    user: "postgres", // Nom d'utilisateur PostgreSQL
    host: "localhost", // Adresse du serveur
    database: "irsa", // Nom de la base de données
    password: "123456789FS", // Votre mot de passe PostgreSQL
    port: 5432, // Port de PostgreSQL
});

// Connexion au client PostgreSQL
client.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err.stack);
  } else {
    console.log("Connexion à la base de données réussie !");
  }
});

module.exports = client;
