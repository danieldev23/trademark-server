require("dotenv").config();
const express = require('express');
const cors = require("cors");
const db = require('./config/db');

const port = process.env.PORT || 3000;
const dbname = process.env.URL_DB;

const app = express();
const route = require('./routes');
const bodyParser = require('body-parser');

db.connect(dbname);
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
route(app)

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`)
});