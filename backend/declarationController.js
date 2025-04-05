const client = require("./db");

const getDeclarations = async (req, res) => {
  try {
    // Requête pour récupérer les déclarations
    const result = await client.query(`
      SELECT ref, idu, "revenuBase", "toutCotis", avantage, "personneACharge", 
      "anneeDec", "irsaDu", statut, "deductionDep", "moisDec", "dateDepot"
      FROM public.declaration;
    `);

    // Envoyer les données en réponse
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des déclarations :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des déclarations" });
  }
};

module.exports = { getDeclarations };
