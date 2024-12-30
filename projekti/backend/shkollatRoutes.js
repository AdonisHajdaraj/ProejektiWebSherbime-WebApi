const express = require('express');
const router = express.Router();
const db = require('./db'); 

router.get('/v1/shkollat', (req, res) => {
  db.query("SELECT * FROM shkollat", (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(result);
  });
});


router.post('/v2/shkollat', (req, res) => {
  const { emri, qyteti } = req.body; 
  const query = 'INSERT INTO shkollat (emri, qyteti) VALUES (?, ?)';
  db.query(query, [emri, qyteti], (err, results) => {
    if (err) {
      res.status(500).send('Gabim në shtimin e shkollës');
    } else {
      res.status(201).json({ id: results.insertId, emri, qyteti });
    }
  });
});


router.put('/v1/shkollat/:id', (req, res) => {
  const { id } = req.params; 
  const { emri, qyteti } = req.body; 
  const query = 'UPDATE shkollat SET emri = ?, qyteti = ? WHERE id = ?'; 
  db.query(query, [emri, qyteti, id], (err, results) => {
    if (err) {
      res.status(500).send('Gabim në përditësimin e shkollës');
    } else {
      res.json({ id, emri, qyteti });
    }
  });
});


router.delete('/v2/shkollat/:id', (req, res) => {
  const { id } = req.params; 
  const query = 'DELETE FROM shkollat WHERE id = ?'; 
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send('Gabim në fshirjen e shkollës');
    } else {
      res.status(200).send('Shkolla u fshi me sukses');
    }
  });
});

module.exports = router;
