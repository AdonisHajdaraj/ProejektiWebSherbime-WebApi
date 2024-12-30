const express = require('express');
const router = express.Router();
const db = require('./db'); 


router.get('/v1/lendet', (req, res) => {
    db.query('SELECT * FROM lendet', (err, results) => {
        if (err) {
            res.status(500).send('Gabim gjatë marrjes së të dhënave nga databaza');
        } else {
            res.json(results);
        }
    });
});


router.post('/v2/lendet', (req, res) => {
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


router.put('/v1/lendet/:id', (req, res) => {
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


router.delete('/v2/lendet/:id', (req, res) => {
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

module.exports = router;
