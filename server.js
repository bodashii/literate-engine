require('dotenv').config();
const express = require("express");
const apiRoutes = require('./routes/apiRoutes');
const Magic = require('./lib/index');

const db = require('./db/connection');

const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes)

app.use((req, res) => {
  res.status(400).end();
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  const magic = new Magic
  magic.seedDatabase();
  magic.mainMenu();
})
