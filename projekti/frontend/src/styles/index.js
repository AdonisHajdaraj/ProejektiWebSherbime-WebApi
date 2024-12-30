const express = require('express');
const app = express();
const mysql = require("mysql");
const cors = require('cors');
const jwt = require('jsonwebtoken'); 
const Memcached = require('memcached');
const secretKey = 'my_secret_key'; 



const memcached = new Memcached('localhost:11211');
const path = require('path');

app.use(cors());
app.use(express.json());
//lidhja me databaze 
const db = require('../backend/db')





//per nota
  app.get("/v1/matematika", (req, res) => {
    db.query("SELECT * FROM matematika", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });


  app.get("/v1/gjuheshqipe", (req, res) => {
    db.query("SELECT * FROM gjuheshqipe", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });

  app.get("/v1/anglisht", (req, res) => {
    db.query("SELECT * FROM anglisht", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });

  app.get("/v1/biologji", (req, res) => {
    db.query("SELECT * FROM biologji", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });

  app.get("/v1/gjeografi", (req, res) => {
    db.query("SELECT * FROM gjeografi", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });


  



  //tabela per Lendet 
  app.get("/v1/lendet", (req, res) => {
    db.query("SELECT * FROM lendet", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });
app.post('/v2/lendet', (req, res) => {
  const { lenda } = req.body;
  const query = 'INSERT INTO lendet (lenda) VALUES (?)';

  db.query(query, [lenda], (err, results) => {
    if (err) {
      res.status(500).send('Gabim në shtimin e lëndës');
    } else {
      memcached.del('lendet', (delErr) => {
        if (delErr) console.error('Gabim në heqjen e cache-së:', delErr);
      });
      res.status(201).json({ id: results.insertId, lenda });
    }
  });
});
app.put('/v1/lendet/:id', (req, res) => {
  const { id } = req.params;
  const { lenda } = req.body;
  const query = 'UPDATE lendet SET lenda = ? WHERE id = ?';

  db.query(query, [lenda, id], (err, results) => {
    if (err) {
      res.status(500).send('Gabim në përditësimin e lëndës');
    } else {
      memcached.del('lendet', (delErr) => {
        if (delErr) console.error('Gabim në heqjen e cache-së:', delErr);
      });
      res.json({ id, lenda });
    }
  });
});
app.delete('/v2/lendet/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM lendet WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send('Gabim në fshirjen e lëndës');
    } else {
      memcached.del('lendet', (delErr) => {
        if (delErr) console.error('Gabim në heqjen e cache-së:', delErr);
      });
      res.status(200).send('Lenda u fshi me sukses');
    }
  });
});
app.get('/v1/lendet', (req, res) => {
  memcached.get('lendet', (err, data) => {
    if (err) {
      console.error('Gabim gjatë leximit të të dhënave nga Memcached:', err);
      res.status(500).send('Gabim gjatë leximit të cache');
    } else if (data) {
      console.log('Të dhënat janë marrë nga Memcached');
      res.json(JSON.parse(data));
    } else {
      db.query('SELECT * FROM lendet', (err, results) => {
        if (err) {
          res.status(500).send('Gabim gjatë marrjes së të dhënave nga databaza');
        } else {
          memcached.set('lendet', JSON.stringify(results), 3600, (memErr) => {
            if (memErr) {
              console.error('Gabim gjatë ruajtjes së të dhënave në Memcached:', memErr);
            } else {
              console.log('Të dhënat u ruajtën në Memcached');
            }
          });
          res.json(results);
        }
      });
    }
  });
});




//per login dhe register
  app.post('/v1/signin', (req, res) => {
    const sql = "SELECT role FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
      if (err) {
        console.error(err); 
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (data.length > 0) {
        const userRole = data[0].role; 
        const payload = { email: req.body.email, role: userRole };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })
        return res.json({ token: token, role: userRole, message: "Success" });
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    });
  });
  

  app.get("/v2/login", (req, res) => {
    db.query("SELECT * FROM login", (err, result) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(result);
    });
  });


  app.post('/v1/register', (req, res) => {
    const sql = "INSERT INTO login (name, email, password) VALUES (?, ?, ?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    if (!values[0] || !values[1] || !values[2]) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Error inserting data into the database" });
        }
        const payload = {
            name: req.body.name,
            email: req.body.email,
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        return res.status(200).json({
            message: "User registered successfully",
            token: token,
        });
    });
});




 //per shkolla
app.get("/v1/shkollat", (req, res) => {
  db.query("SELECT * FROM shkollat", (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(result);
  });
});

  app.post('/v2/shkollat', (req, res) => {
    const { emri, qyteti } = req.body; // Përdorimi i të dhënave të dërguara nga frontend
    const query = 'INSERT INTO shkollat (emri, qyteti) VALUES (?, ?)'; // Pyetje për të shtuar një rresht të ri
    db.query(query, [emri, qyteti], (err, results) => {
      if (err) {
        res.status(500).send('Gabim në shtimin e shkollës');
      } else {
        res.status(201).json({ id: results.insertId, emri, qyteti });
      }
    });
  });
  
  app.put('/v1/shkollat/:id', (req, res) => {
    const { id } = req.params; // Merrni ID-në e shkollës që po editohet
    const { emri, qyteti } = req.body; // Merrni të dhënat e reja
    const query = 'UPDATE shkollat SET emri = ?, qyteti = ? WHERE id = ?'; // Pyetje për të përditësuar një shkollë
    db.query(query, [emri, qyteti, id], (err, results) => {
      if (err) {
        res.status(500).send('Gabim në përditësimin e shkollës');
      } else {
        res.json({ id, emri, qyteti });
      }
    });
  });

  app.delete('/v2/shkollat/:id', (req, res) => {
    const { id } = req.params; // Merrni ID-në e lëndës që do të fshihet
    const query = 'DELETE FROM shkollat WHERE id = ?'; // Pyetje për të fshirë një lëndë
    db.query(query, [id], (err, results) => {
      if (err) {
        res.status(500).send('Gabim në fshirjen e shkoles');
      } else {
        res.status(200).send('shkolla u fshi me sukses');
      }
    });
  });


  app.listen(3001, () => {
    console.log("Server is listening on port 3001");
  })
  