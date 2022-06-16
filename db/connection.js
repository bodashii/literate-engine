const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "engine_db",
  },
  console.log("Connection to database successful.")
);

module.exports = db;
