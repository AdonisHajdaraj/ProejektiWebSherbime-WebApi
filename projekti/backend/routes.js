const express = require('express');
const router = express.Router();
const db = require('./db');


router.get("/v1/matematika", (req, res) => {
    db.query("SELECT * FROM matematika", (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(result);
    });
});


router.get("/v1/gjuheshqipe", (req, res) => {
    db.query("SELECT * FROM gjuheshqipe", (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(result);
    });
});


router.get("/v1/anglisht", (req, res) => {
    db.query("SELECT * FROM anglisht", (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(result);
    });
});


router.get("/v1/biologji", (req, res) => {
    db.query("SELECT * FROM biologji", (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(result);
    });
});


router.get("/v1/gjeografi", (req, res) => {
    db.query("SELECT * FROM gjeografi", (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(result);
    });
});

module.exports = router;
