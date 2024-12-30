const express = require("express");
const db = require("../backend/config/db"); // Importo lidhjen me databazën

const app = express();
app.use(express.json()); // Middleware për JSON parsing

// Endpoint për të marrë të gjitha shkollat (GET)
app.get("/v1/shkollat", (req, res) => {
  const query = "SELECT * FROM shkollat";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(result);
  });
});

// Endpoint për të shtuar një shkollë të re (POST)
app.post("/v2/shkollat", (req, res) => {
  const { emri, qyteti } = req.body;

  // Validimi i të dhënave hyrëse
  if (!emri || !qyteti) {
    return res.status(400).json({ message: "Emri dhe qyteti janë të nevojshëm" });
  }

  const query = "INSERT INTO shkollat (emri, qyteti) VALUES (?, ?)";
  db.query(query, [emri, qyteti], (err, results) => {
    if (err) {
      console.error("Gabim në shtimin e shkollës:", err);
      return res.status(500).json({ message: "Gabim në shtimin e shkollës" });
    }
    res.status(201).json({ id: results.insertId, emri, qyteti });
  });
});

// Endpoint për të përditësuar një shkollë ekzistuese (PUT)
app.put("/v1/shkollat/:id", (req, res) => {
  const { id } = req.params;
  const { emri, qyteti } = req.body;

  // Validimi i të dhënave hyrëse
  if (!emri || !qyteti) {
    return res.status(400).json({ message: "Emri dhe qyteti janë të nevojshëm" });
  }

  const query = "UPDATE shkollat SET emri = ?, qyteti = ? WHERE id = ?";
  db.query(query, [emri, qyteti, id], (err, results) => {
    if (err) {
      console.error("Gabim në përditësimin e shkollës:", err);
      return res.status(500).json({ message: "Gabim në përditësimin e shkollës" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Shkolla nuk u gjet" });
    }
    res.json({ id, emri, qyteti });
  });
});

// Endpoint për të fshirë një shkollë (DELETE)
app.delete("/v2/shkollat/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM shkollat WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Gabim në fshirjen e shkollës:", err);
      return res.status(500).json({ message: "Gabim në fshirjen e shkollës" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Shkolla nuk u gjet" });
    }
    res.status(200).json({ message: "Shkolla u fshi me sukses" });
  });
});

// Porta për aplikacionin
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Serveri po funksionon në portën ${PORT}`);
});
