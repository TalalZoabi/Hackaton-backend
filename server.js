const express = require("express");
const server = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.json());
server.use(
  cors({
    origin: true,
    credentials: true,
  })
);
server.use(require("./Route"));
server.listen(5656, () => {
  console.log(`server opening with port 5656`);
});

