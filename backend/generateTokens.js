const { OAuth2Client } = require("google-auth-library");

const clientId = "835330202615-79amf8gknib99sna8tj556og7q0l8u1r.apps.googleusercontent.com"; // Remplacez par votre client ID
const clientSecret = "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"; // Remplacez par votre secret client
const redirectUri = "urn:ietf:wg:oauth:2.0:oob"; // Pour application de bureau

const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

async function getTokens() {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://mail.google.com/"], // Portée pour accéder à Gmail
    });

    console.log("Autorisez cette application en visitant l'URL suivante :");
    console.log(authUrl);

    // Collez ici le code après avoir autorisé l'application
    const code = "COLLEZ_LE_CODE_REÇU_ICI";

    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Jetons générés :");
    console.log("Access Token :", tokens.access_token);
    console.log("Refresh Token :", tokens.refresh_token);
}

getTokens().catch(console.error);
