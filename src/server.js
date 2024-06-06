require("dotenv").config();
const express = require('express');
const cors = require("cors");
const db = require('./config/db');

const port = 3000;
console.log(`Port is: ${process.env.PORT}`);
const app = express();
const route = require('./routes');
const bodyParser = require('body-parser');

db.connect();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
route(app)

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`)
});