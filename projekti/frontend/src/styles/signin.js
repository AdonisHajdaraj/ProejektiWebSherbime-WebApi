const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../backend/db');
const router = express.Router(); // Përdor Router për të krijuar ruterat

const secretKey = 'yourSecretKey'; // Çelësi sekret për JWT

router.post('/v1/signin', (req, res) => {
    const sql = "SELECT role FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (data.length > 0) {
        const userRole = data[0].role;
        const payload = { email: req.body.email, role: userRole };

        // Gjenero token-in
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Kthe token-in dhe rolin
        return res.json({ token: token, role: userRole, message: "Success" });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    });
});

module.exports = router; // Eksporto router-in për t'u përdorur në index.js
