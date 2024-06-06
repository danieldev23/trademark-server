// require("dotenv").config();
const express = require('express');
const cors = require("cors");
const db = require('./config/db');

const port = 3000;
const app = express();
const route = require('./routes');
const bodyParser = require('body-parser');

db.connect();
app.use(cors());
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`);
  });
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
route(app)

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`)
});