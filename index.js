"use strict";

const express = require("express");
const app = express();

app.use(express.static("dist"));

const PORT = process.env.PORT || 4888;

app.listen(PORT, (err) => {
  if (err) return console.error(err);

  console.log(`Listening on ${PORT}`);
});
