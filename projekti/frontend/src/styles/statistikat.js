const express = require("express");
const db = require("../backend/config/db"); // Importo lidhjen me databazën

const app = express();
app.use(express.json()); // Middleware për JSON parsing

// Funksion i përgjithshëm për trajtimin e kërkesave
const handleGetRequest = (tableName) => {
  return (req, res) => {
    const query = `SELECT * FROM ??`; // Përdor placeholders për emrin e tabelës
    db.query(query, [tableName], (err, result) => {
      if (err) {
        console.error(`Error querying database (${tableName}):`, err);
        return res.status(500).send("Internal Server Error");
      }
      res.send(result);
    });
  };
};

// Endpoint-e për tabelat
app.get("/v1/matematika", handleGetRequest("matematika"));
app.get("/v1/gjuheshqipe", handleGetRequest("gjuheshqipe"));
app.get("/v1/anglisht", handleGetRequest("anglisht"));
app.get("/v1/biologji", handleGetRequest("biologji"));
app.get("/v1/gjeografi", handleGetRequest("gjeografi"));

// Porta për aplikacionin
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveri po funksionon në portën ${PORT}`);
});
