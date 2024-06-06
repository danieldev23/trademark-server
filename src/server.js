require("dotenv").config();
const express = require('express');
const cors = require("cors");
const db = require('./config/db');

const port = 3000;
const dbname = "mongodb+srv://huydq23itb:OZ959l8m1ORJbiPe@trademark.qbrpwak.mongodb.net/";

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