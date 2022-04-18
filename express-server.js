const express = require("express");
const app = express();
const port = 8080; // default port 8080

const urlDatase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Example app listening to port ${port}!`);
});
