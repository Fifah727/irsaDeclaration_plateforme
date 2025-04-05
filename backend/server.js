const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());



const pool = new Pool({
    user: "postgres", // Nom d'utilisateur PostgreSQL
  host: "localhost", // Adresse du serveur
  database: "irsa", // Nom de la base de données
  password: "123456789FS", // Votre mot de passe PostgreSQL
  port: 5432, // Port de PostgreSQL
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
    } else {
        console.log('Connexion à la base réussie.');
        release();
    }
});

app.get('/directions', async (req, res) => {
    try {
        const result = await pool.query('SELECT "idDir", "nomDir", "regionDir" FROM public.direction');
        res.json(result.rows); // Renvoie les données
    } catch (error) {
        console.error("Erreur dans la route /directions :", error); // Log de diagnostic
        res.status(500).json({ message: 'Erreur lors de la récupération des directions.' });
    }
});

// REGISTER
app.post('/register', async (req, res) => {
    const { nom, prenom, cin, fonction, nif, mdp, idDir, email } = req.body;

    try {
        // Vérifier si le NIF existe déjà
       
        const cinCheck = await pool.query('SELECT * FROM public."user" WHERE "cin" = $1', [cin]);
        //const nifCheck = await pool.query('SELECT * FROM user WHERE nif = $1', [nif]);

        if (cinCheck.rows.length > 0) {
            // Si le NIF est déjà utilisé, renvoyer un message d'erreur
            return res.status(400).json({ message: 'Le CIN est déjà enregistré pour un autre utilisateur.' });
        }

        const emailCheck = await pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'L\'adresse email est déjà utilisé par un autre utilisateur.' });
        }
        const nifCheck = await pool.query('SELECT * FROM public."user" WHERE "nif" = $1', [nif]);
        //const nifCheck = await pool.query('SELECT * FROM user WHERE nif = $1', [nif]);

        if (nifCheck.rows.length > 0) {
            // Si le NIF est déjà utilisé, renvoyer un message d'erreur
            return res.status(400).json({ message: 'Le NIF est déjà utilisé par un autre utilisateur.' });
        }

        // Si le NIF n'existe pas, hasher le mot de passe et insérer l'utilisateur
        const hashedPassword = await bcrypt.hash(mdp, 10);

        const result = await pool.query(
            'INSERT INTO public."user" ("nom", "prenom", "cin", "fonction", "nif", "mdp", "idDir","email") VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *',
            [nom, prenom, cin, fonction, nif, hashedPassword, idDir,email]
        );
        
        res.status(201).json({ message: 'Utilisateur enregistré avec succès', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { nif, mdp } = req.body;

    try {
        // Vérification du NIF
        const userCheck = await pool.query('SELECT * FROM public."user" WHERE "nif" = $1', [nif]);

        if (userCheck.rows.length === 0) {
            return res.status(400).json({ message: "NIF incorrect ou utilisateur non trouvé." });
        }

        const user = userCheck.rows[0];

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(mdp, user.mdp);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Mot de passe incorrect." });
        }

        // Réponse avec les détails de l'utilisateur, y compris l'ID
        res.status(200).json({
            message: "Connexion réussie.",
            user: { idu: user.idu, nom: user.nom, prenom: user.prenom, email : user.email },
        });
    } catch (error) {
        console.error("Erreur lors de l'authentification :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Route pour gérer l'envoi d'email
// const sendEmail = require("./mailer");
// app.post("/send-email", async (req, res) => {
//     const { to, subject, text } = req.body;
//     console.log(req.body);
//     try {
//       // Utiliser la fonction sendEmail du fichier mailer.js
//       await sendEmail(to, subject, text);
//       res.status(200).send("Email envoyé avec succès !");
//     } catch (error) {
//       console.error("Erreur lors de l'envoi de l'email :", error);
//       res.status(500).send("Erreur lors de l'envoi de l'email.");
//     }
// });

// Route pour gérer l'envoi d'email
const { sendEmail } = require("./mailer");
app.post("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;
    console.log(req.body);

    try {
        // Vérification SMTP avant d'envoyer
        // annuler
        // Envoi d'email
        await sendEmail(to, subject, text);
        res.status(200).send("Email envoyé avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        res.status(500).send("Erreur lors de l'envoi de l'email.");
    }
});


// get User By IDu
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM public."user" WHERE idu = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// UPDATE User
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { nom, prenom, fonction, mdp, idDir,email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(mdp, 10);
        await pool.query(
            'UPDATE public."user" SET nom = $1, prenom = $2, fonction = $3, mdp = $4, "idDir" = $5,email = $6  WHERE idu = $7',
            [nom, prenom, fonction, hashedPassword, idDir,email, id]
        );
        res.json({ message: "Informations mises à jour avec succès." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour des informations utilisateur :", error
            ,nom, prenom, fonction, mdp, idDir
        );
        res.status(500).json({ message: "Erreur serveur." });
    }
});

// get declarations
app.get("/declarations/:idu", async (req, res) => {
    const { idu } = req.params;

    try {
        const results = await pool.query(
            `SELECT ref, idu, "revenuBase", "toutCotis", avantage, 
                    "personneACharge", "anneeDec", "irsaDu", statut, 
                    "deductionDep", "moisDec", "dateDepot"
             FROM public.declaration  WHERE idu = $1
             ORDER BY "anneeDec", 
            CASE 
                WHEN "moisDec" = 'janvier' THEN 1
                WHEN "moisDec" = 'février' THEN 2
                WHEN "moisDec" = 'mars' THEN 3
                WHEN "moisDec" = 'avril' THEN 4
                WHEN "moisDec" = 'mai' THEN 5
                WHEN "moisDec" = 'juin' THEN 6
                WHEN "moisDec" = 'juillet' THEN 7
                WHEN "moisDec" = 'août' THEN 8
                WHEN "moisDec" = 'septembre' THEN 9
                WHEN "moisDec" = 'octobre' THEN 10
                WHEN "moisDec" = 'novembre' THEN 11
                WHEN "moisDec" = 'décembre' THEN 12
            END,
            "dateDepot" ASC`,[idu]
            
        );
        res.json(results.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des déclarations :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


// get declarations
app.get("/declaration/:refdec", async (req, res) => {
    const { refdec } = req.params;

    try {
        const results = await pool.query(
            `SELECT * FROM public.declaration
            INNER JOIN public.user ON public.user.idu=public.declaration.idu
            WHERE ref = $1`, 
            [refdec]
        );
        res.json(results.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération du déclaration :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post('/insertDec', async (req, res) => {
    const {idu, revenuBase, toutCotis, avantage, personneACharge, anneeDec, irsaDu, statut, deductionDep, moisDec, dateDepot } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO public.declaration(
                idu, "revenuBase", "toutCotis", avantage, "personneACharge", "anneeDec", "irsaDu", statut, "deductionDep", "moisDec", "dateDepot"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [idu, revenuBase, toutCotis, avantage, personneACharge, anneeDec, irsaDu, statut, deductionDep, moisDec, dateDepot]
        );
        
        res.status(201).json({ message: 'Déclaration enregistrée avec succès', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de la déclaration.' });
    }
});

// get mois et année deja déclarés
app.get('/moisAnsDeclare/:idu', async (req, res) => {
    const { idu } = req.params;
    try {
        // Récupère uniquement les colonnes "moisDec" et "anneeDec" depuis la table "Declaration"
        const declarations = await pool.query(
            `SELECT "anneeDec", "moisDec"
             FROM public.declaration  WHERE idu = $1`,[idu]
        );
        res.json(declarations.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

// const { Pool } = require('pg');

// // Configuration de la connexion
// const pool = new Pool({
//     user: "postgres", // Nom d'utilisateur PostgreSQL
//     host: "localhost", // Adresse du serveur
//     database: "irsa", // Nom de la base de données
//     password: "123456789FS", // Mot de passe PostgreSQL
//     port: 5432, // Port PostgreSQL
// });

// // Fonction pour tester la connexion et récupérer les données
// const testConnection = async () => {
//     try {
//         // Requête pour récupérer les données de la table "user"
//         const result = await pool.query('SELECT * FROM public."user"'); 
//         console.log("Données récupérées depuis la base :");
//         console.log(result.rows); // Affiche les lignes dans la console
//     } catch (error) {
//         console.error("Erreur lors de la connexion ou récupération des données :", error.message);
//     } finally {
//         pool.end(); // Fermer la connexion à la base
//     }
// };

// const testQuery = async () => {
//     try {
//         const result = await pool.query('SELECT "nif" FROM public."user" LIMIT 1');
//         console.log(result.rows);
//     } catch (error) {
//         console.error('Erreur lors de la récupération de "nif" :', error.message);
//     }
// };
// testQuery();


// // Exécute la fonction
// testConnection();

// OPEN AI TEST
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { OpenAI } = require("openai");

// const app = express();
// app.use(cors());
// app.use(express.json());

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// app.post("/chat", async (req, res) => {
//     try {
//         const { message } = req.body;

//         const response = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             prompt: 'Votre prompt ici...',
//             messages: [
//               { role: "system", content: "Tu es un assistant expert en fiscalité IRSA à Madagascar." },
//               { role: "user", content: message }
//           ],
//             max_tokens: 150,
//         });

//         res.json({ reply: response.choices[0].message.content });
//     } catch (error) {
//         if (error.response && error.response.status === 429) {
//             console.error('Quota dépassé : vérifiez votre plan ou réduisez la fréquence des appels.');
//           } else {
//             console.error('Une erreur s\'est produite :', error.message);
//           }
//         console.error(error);
//         res.status(500).json({ error: "Erreur avec OpenAI API" });
//     }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));

