const express = require('express');
const db = require('../backend/db');
const router = express.Router(); // Përdorim Router për të krijuar ruterat

// Middleware për verifikimin e token-it JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token i munguar');
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).send('Token i pavlefshëm');
        }
        req.user = decoded;
        next();
    });
};

// Endpoint për të shtuar lëndë (POST) - Kërkon JWT
router.post('/v2/lendet', verifyToken, (req, res) => {
    const { lenda } = req.body;
    const query = 'INSERT INTO lendet (lenda) VALUES (?)';

    db.query(query, [lenda], (err, results) => {
        if (err) {
            res.status(500).send('Gabim në shtimin e lëndës');
        } else {
            res.status(201).json({ id: results.insertId, lenda });
        }
    });
});

// Endpoint për të përditësuar lëndën (PUT) - Kërkon JWT
router.put('/v1/lendet/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { lenda } = req.body;
    const query = 'UPDATE lendet SET lenda = ? WHERE id = ?';

    db.query(query, [lenda, id], (err, results) => {
        if (err) {
            res.status(500).send('Gabim në përditësimin e lëndës');
        } else {
            res.json({ id, lenda });
        }
    });
});

// Endpoint për të fshirë lëndë (DELETE) - Kërkon JWT
router.delete('/v2/lendet/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM lendet WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send('Gabim në fshirjen e lëndës');
        } else {
            res.status(200).send('Lenda u fshi me sukses');
        }
    });
});

// Endpoint për të marrë
router.get('/v1/lendet', (req, res) => {
    db.query('SELECT * FROM lendet', (err, result) => {
        if (err) {
            res.status(500).send('Gabim në marrjen e lëndëve');
        } else {
            res.json(result);
        }
    });
});

module.exports = router;