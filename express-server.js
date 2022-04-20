const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const port = 8080;
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "TuYgsb": "http://youtube.com",
  "xCdPoi": "http://netflix.com",
};

// generates a random short URL
const generateRandomString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// ROUTERS
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// sets the username cookie and redirects back to /urls
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

// clears username cookie and redirects back to /urls
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// renders an index of all urls in the url database
app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies.username, urls: urlDatabase };
  res.render("urls-index", templateVars);
});

// adds a new url value to the database with a generated short url key
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls"); 
});

// renders the new url submission page
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies.username };
  res.render("urls-new", templateVars);
});

// updates an existing resource in url database to a new url
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

// redirects to the resource url based on the short url
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// renders url edit page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls-show", templateVars);
});

// deletes an existing url from the urlDatabase object
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});