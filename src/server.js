require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const port = process.env.PORT || 3000;
const dbname = process.env.MONGODB_CONNECT_URI;
const app = express();
const route = require("./routes");
const bodyParser = require("body-parser");

db.connect(dbname);
app.use(cors());
// Middleware to log request

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
route(app);

app.listen(port, () => {
  console.log(`Application listening at http://localhost:${port}`);
});
