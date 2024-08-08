const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./dbs/mongo");
const swagger = require("../swagger");

const app = express();

// Kết nối tới MongoDB
connectDB();


app.use(bodyParser.json());
swagger(app);

require("dotenv").config();

require("./dbs/mongo");
app.use(require("./routes"));
module.exports = app;

