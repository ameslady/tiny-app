/* REQUIRE STATEMENTS */

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { render } = require("express/lib/response");

/* {ADD HEADING HERE} */

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


/* GLOBAL VARIABLES */

const port = 8080;
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "TuYgsb": "http://youtube.com",
  "xCdPoi": "http://netflix.com",
};
const users = { 
  "yHko9F": {
    id: "yHko9F", 
    email: "amy@test.com", 
    password: "test"
  }
}

/* FUNCTIONS */ 

// generates a random short URL
const generateRandomString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// checks if an email already exists in users
const emailLookup = function(email) {
  for (const id in users) {
    if (users[id].email === email) {
      return true;
    }
  }
  return false;
};

// checks for the correct password
const validPassword = function(password) {
  for (const id in users) {
    if (users[id].password === password) {
      return true;
    }
  }
  return false;
};

/* REQUESTS */

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// renders an index of all urls in the url database
app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  const templateVars = { user: users[user_id], urls: urlDatabase };
  res.render("urls-index", templateVars);
});

// adds a new url value to the database with a generated short url key
app.post("/urls", (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect("/urls"); 
});

// renders the new url submission page
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"]; 
  const templateVars = { user: users[user_id] };
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
  const user_id = req.cookies["user_id"]; 
  const templateVars = {
    user: users[user_id],
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

// renders registration page
app.get("/register", (req, res) => {
  res.render("register");
});

// registers a new user to user database 
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    res.status(400).send('Password and email are required to register.')
  } else {
    if (emailLookup(email)) {
      res.status(400).send('User already exists.')
    } else {
      const randomId = generateRandomString();
      users[randomId] = {
        id: randomId,
        email: email,
        password: password
      }
      res.cookie('user_id', randomId);
    }
  }
  res.redirect("/urls");
});

// renders the login page
app.get("/login", (req, res) => {
  res.render("login");
})

// checks for an existing user and logs them in
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    res.status(400).send('Password and email are required to login.')
  } else {
    if (!emailLookup(email) || !validPassword(password)) {
      res.status(403).send('Invalid credentials.')
    } else {
      const user_id = Object.keys(users).find(key => users[key].email === email);
      res.cookie('user_id', user_id)
      res.redirect("/urls");
    }
  }
});

// clears user_id cookie and redirects back to /urls
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});