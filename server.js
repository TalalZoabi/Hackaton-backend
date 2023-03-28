const express = require("express");
const server = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

const port = process.env.PORT || 5000;

server.use(
  cors({
    origin: true,
    credentials: true,
  })
);
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.json());
server.use(require("./routes/searchRoute"));
server.listen(port, () => {
  console.log(`server opening with port ${port}`);
});
