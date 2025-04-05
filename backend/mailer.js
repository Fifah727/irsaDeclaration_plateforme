// const nodemailer = require("nodemailer");
// // require("dotenv").config();

// // Configurer le transporteur SMTP
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "mfilamatriniarivosoanera@gmail.com",
//     pass: "pdrg qrme fnyx kvfv",
//   },
// });

// const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// // Fonction pour envoyer un email
// const sendEmail = async (to, subject, text) => {

//   if (!isValidEmail(to)) {
//     console.error("Adresse email invalide :", to);
//     return { success: false, message: "L'adresse email n'est pas valide." };
//   }

//   const mailOptions = {
//     from: "mfilamatriniarivosoanera@gmail.com", // L'expéditeur
//     to: to, // Destinataire
//     subject: subject, // Sujet de l'email
//     text: text, // Contenu de l'email (texte brut)
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email envoyé : ", info.response);
//   } catch (error) {
//     console.error("Erreur lors de l'envoi de l'email : ", error);
//   }
// };

// module.exports = sendEmail;

//const nodemailer = require("nodemailer");
const { SMTPClient } = require("smtp-client");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Fonction pour vérifier l'adresse email via SMTP
// const pingEmailAddress = async (email) => {
//   const domain = "smtp.gmail.com";
//   const client = new SMTPClient({
//     host: `${domain}`,
//     port: 25, // Port standard pour SMTP
//   });

//   try {
//     await client.connect();
//     await client.greet({ hostname: "smtp.gmail.com" }); // Remplacez par votre domaine
//     await client.mail({ from: "mfilamatriniarivosoanera@gmail.com" });
//     const response = await client.rcpt({ to: email });
//     await client.quit();

//     // Vérification du code de réponse
//     return response.code === 250; // Le code 250 indique que l'adresse est valide
//   } catch (err) {
//     console.error("Erreur de vérification SMTP :", err.message);

//     // Ajoutez ceci pour afficher les détails de l'erreur
//     console.log("Détails de l'erreur : ", err);
//     return false;
//   }
// };
// const pingEmailAddress = async (email) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       type: "OAuth2",
//       user: "mfilamatriniarivosoanera@gmail.com",
//       clientId: "835330202615-79amf8gknib99sna8tj556og7q0l8u1r.apps.googleusercontent.com", // Remplacez par votre ID client
//       clientSecret: "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", // Remplacez par votre secret client
//       refreshToken: "VOTRE_JETON_DE_RAFRAÎCHISSEMENT", // Jeton généré dans la console
//       accessToken: "VOTRE_JETON_D'ACCÈS" // (Optionnel) Généré dynamiquement
//     },
//   });

//   try {
//     // Vérification de l'email (ping simulé avec `verify`)
//     await transporter.verify();
//     console.log(`Connexion réussie au serveur SMTP.`);

//     // Ensuite, procédez à l'envoi ou à la vérification des adresses e-mail
//     console.log(`Ping de l'adresse email : ${email} - OK`);
//     return true;
//   } catch (err) {
//     console.error("Erreur de vérification SMTP :", err.message);
//     console.log("Détails de l'erreur :", err);
//     return false;
//   }
// };


// Fonction principale pour envoyer un email
const sendEmail = async (to, subject, text) => {
  const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to); // Vérification du format

  if (!isValidFormat) {
    console.error("Adresse email invalide :", to);
    return { success: false, message: "L'adresse email n'est pas au bon format." };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mfilamatriniarivosoanera@gmail.com",
      pass: "pdrg qrme fnyx kvfv",
    },
  });

  const mailOptions = {
    from: "mfilamatriniarivosoanera@gmail.com", // L'expéditeur
    to: to, // Destinataire
    subject: subject, // Sujet de l'email
    text: text, // Contenu de l'email
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé : ", info.response);
    return { success: true, message: "Email envoyé avec succès !" };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return { success: false, message: "Une erreur s'est produite lors de l'envoi." };
  }
};

module.exports = { sendEmail };
