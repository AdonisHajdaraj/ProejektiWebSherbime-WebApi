const mysql = require('mysql');

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "smis",
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = db;
