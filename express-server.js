/* REQUIRE STATEMENTS */

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { render } = require("express/lib/response"); // what is dis?

/* {ADD HEADING HERE} */

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


/* GLOBAL VARIABLES */

const port = 8080;

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "yHko9F"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "yHko9F"
  },
  TuYgsb: {
    longURL: "http://youtube.com",
    userID: "test"
  },
  xCdPoi: {
    longURL: "http://netflix.com",
    userID: "yHko9F"
  },
};

const users = { 
  "yHko9F": {
    id: "yHko9F", 
    email: "amy@test.com", 
    password: "test"
  }
}

/* FUNCTIONS - move to helper file */ 

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

// checks for the correct password - refactor this into emailLookup
const validPassword = function(password) {
  for (const id in users) {
    if (users[id].password === password) {
      return true;
    }
  }
  return false;
};

// creates a new object with specific users urls
const urlsForUser = function(id) {
  const userUrls = {};

  for (const url in urlDatabase){
    if (id === urlDatabase[url].userID) {
      userUrls[url] = urlDatabase[url];
    }
  } 
  return userUrls;
};

/* ROUTES 
* - remove redundant comments
* - organized based on type of request (GET, POST, etc.)
*/


// what is this even doing?
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// renders an index of all urls in the url database
app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];

  if (!user_id) {
    res.redirect("login");
  } else {
    const templateVars = { user: users[user_id], urls: urlsForUser(user_id)};
    res.render("urls-index", templateVars);
  }
});

// if logged in, adds a new url value to the database with a generated short url key
app.post("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];

  if (!user_id) {
    res.status(401).send('Not authorized to create a new short URL.')
  } else {
    urlDatabase[generateRandomString()] = {
      longURL: req.body.longURL,
      userID: user_id
    };
    res.redirect("/urls"); 
  }
});

// if logged in, renders the new url submission page
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"]; 
  const templateVars = { user: users[user_id] };

  if (!user_id) {
    res.redirect("/login");
  } else {
    res.render("urls-new", templateVars);
  }
});

// updates an existing resource in url database to a new url
app.post("/urls/:id", (req, res) => {
  const user_id = req.cookies["user_id"];
  const editor = urlDatabase[req.params.id].userID;

  if (user_id !== editor) {
    res.status(401).send('Not authorized to edit this URL.');
  } else {
    urlDatabase[req.params.id] = {
      longURL: req.body.longURL,
      userID: user_id
    }; 
    res.redirect("/urls");
  }
});

// redirects to the resource url based on the short url (change to)
app.get("/u/:shortURL", (req, res) => {
  const longURL = new URL(urlDatabase[req.params.shortURL].longURL);
  res.redirect(longURL);
});

// renders url edit page
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"]; 
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL].longURL;
  const editor = urlDatabase[req.params.shortURL].userID;

  if (!user_id) {
    res.redirect("/login");
  } else {
    if (user_id !== editor) {
      res.status(401).send('Not authorized to show this URL.');
    } else {
      const templateVars = {
        user: users[user_id],
        shortURL: shortURL,
        longURL: longURL
      }; 
      res.render("urls-show", templateVars);
    }
  }
});

// deletes an existing url from the urlDatabase object
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.cookies["user_id"];
  const editor = urlDatabase[req.params.shortURL].userID;

  if (user_id !== editor) {
    res.status(401).send('Not authorized to delete this URL.');
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
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
      res.redirect("/urls");
    }
  }
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