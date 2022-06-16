require('dotenv').config();
const express = require("express");
const apiRoutes = require('./routes/apiRoutes')
const db = require('./db/connection');

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(400).end();
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`);
  });
});
