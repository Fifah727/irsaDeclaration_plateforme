const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// Configuration PostgreSQL
const pool = new Pool({
  user: "postgres", // Nom d'utilisateur PostgreSQL
  host: "localhost", // Adresse du serveur
  database: "irsa", // Nom de la base de données
  password: "123456789FS", // Votre mot de passe PostgreSQL
  port: 5432, // Port de PostgreSQL
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes CRUD

// Lire tous les utilisateurs
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur serveur");
  }
});

// Créer un utilisateur
app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *",
      [name, email, age]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur serveur");
  }
});

// Mettre à jour un utilisateur
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  try {
    await pool.query(
      "UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4",
      [name, email, age, id]
    );
    res.send("Utilisateur mis à jour");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur serveur");
  }
});

// Supprimer un utilisateur
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.send("Utilisateur supprimé");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Erreur serveur");
  }
});

//
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
const sendEmail = require("./mailer"); // Importer le service mailer.js

// const app = express();

// Middleware
app.use(cors()); // Autoriser les requêtes Cross-Origin
app.use(bodyParser.json()); // Parser les données JSON

// Route pour gérer l'envoi d'email
app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    // Utiliser la fonction sendEmail du fichier mailer.js
    await sendEmail(to, subject, text);
    res.status(200).send("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).send("Erreur lors de l'envoi de l'email.");
  }
});

// Lancer le serveur
const PORT = 5000; // Le port doit correspondre à celui attendu par votre frontend
app.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
});


const { getDeclarations } = require("./declarationController");

// Route pour récupérer les déclarations
app.get("/api/declarations", getDeclarations);

