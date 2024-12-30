const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../backend/config/db"); // Importo lidhjen me databazën
require("dotenv").config(); // Përdor dotenv për variablat e mjedisit

const app = express();
const secretKey = process.env.JWT_SECRET || "default_secret"; // Merr çelësin sekret nga mjedisi

app.use(express.json()); // Middleware për JSON parsing

// Login (Sign In)
app.post("/v1/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT email, password, role FROM login WHERE email = ?";
  db.query(sql, [email], async (err, data) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (data.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password); // Kontrollo hash-in

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Gjenero token-in
    const payload = { email: user.email, role: user.role };
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

    return res.json({
      message: "Login successful",
      token: token,
      role: user.role,
    });
  });
});

// Regjistrimi i përdoruesve të rinj
app.post("/v1/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash fjalëkalimin

    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Error inserting user into database" });
      }

      // Krijo JWT token për përdoruesin e regjistruar
      const payload = { name, email };
      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      return res.status(201).json({
        message: "User registered successfully",
        token: token,
      });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint për të marrë të gjithë përdoruesit
app.get("/v2/login", (req, res) => {
  const sql = "SELECT id, name, email, role FROM login"; // Mos ekspozo fjalëkalimet
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(result);
  });
});

// Porta për aplikacionin
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveri po funksionon në portën ${PORT}`);
});
