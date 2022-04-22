/* REQUIRE STATEMENTS */

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers.js');

const { render } = require("express/lib/response"); // what is dis?

const app = express();
app.set("view engine", "ejs");

/* MIDDLEWARE FUNCTIONS */

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['hubbabubba']
}));


/* GLOBAL VARIABLES */

const port = 8080;

const urlDatabase = {
  b2xVn2: { longURL: "https://youtu.be/C4Mc2580ipw", userID: "yHko9F" },
  i3BoGr: { longURL: "https://youtu.be/N5SFIXpnqyw", userID: "yHko9F" },
  TuYgsb: { longURL: "https://youtu.be/FDkUApLcTYY", userID: "test" },
  xCdPoi: { longURL: "https://youtu.be/QrcrrIlKen0", userID: "yHko9F" },
};

const users = { 
  "yHko9F": { id: "yHko9F", email: "amy@test.com", password: '$2a$10$8SmUevZlhV2p1GxFM5mw/.j98UFF3LHQCdQAM3I2Hx.SzM4eQQaV.' }
}


/* GET ROUTES */

app.get("/urls.json", (req, res) => { // is this needed?
  res.json(urlDatabase);
});

// renders an index of urls for the logged in user
app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;

  if (!user_id) {
    res.redirect("login");
  } else {
    const templateVars = { user: users[user_id], urls: urlsForUser(user_id, urlDatabase)};
    res.render("urls-index", templateVars);
  }
});

// renders the new url submission page
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id; 
  const templateVars = { user: users[user_id] }; // do these need to be sent?

  if (!user_id) {
    res.redirect("/login");
  } else {
    res.render("urls-new", templateVars);
  }
});

// redirects to the resource url based on the short url
app.get("/u/:shortURL", (req, res) => {
  if (req.params.shortURL in urlDatabase) {
    const longURL = urlDatabase[req.params.shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send('Not a Valid URL.');
  }
});

// renders url edit page
app.get("/urls/:shortURL", (req, res) => {
  if (req.params.shortURL in urlDatabase) {
    const user_id = req.session.user_id; 
    const creator = urlDatabase[req.params.shortURL].userID;

    if (!user_id) {
      res.redirect("/login");
    } else {
      if (user_id !== creator) {
        res.status(401).send('Not authorized to show this URL.');
      } else {
        const templateVars = {
          user: users[user_id],
          shortURL: req.params.shortURL,
          longURL: urlDatabase[req.params.shortURL].longURL
        }; 
        res.render("urls-show", templateVars);
      }
    }
  } else {
    res.status(404).send('URL Not Found.');
  }
});

// renders registration page
app.get("/register", (req, res) => {
  const user_id = req.session.user_id;

  if (user_id) {
    res.redirect("urls")
  } else {
    res.render("register");
  }
});

// renders the login page
app.get("/login", (req, res) => {
  const user_id = req.session.user_id;

  if (user_id) {
    res.redirect("urls");
  } else {
    res.render("login");
  }
});

// renders the error page
app.get("/error", (req, res) => {
  res.render("error");
});

/* POST ROUTES */

// creates a new url and adds it to url database 
app.post("/urls", (req, res) => {
  const user_id = req.session.user_id;

  if (user_id) {
    const randomId = generateRandomString();

    urlDatabase[randomId] = {
      longURL: req.body.longURL,
      userID: user_id
    };
    res.redirect(`/urls/${randomId}`); 
  } else {
    res.status(401).send('Not authorized to create a new short URL.')
  }
});

// updates an existing resource in url database to a new url
app.post("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  const creator = urlDatabase[req.params.id].userID;

  if (user_id === creator) {
    urlDatabase[req.params.id] = {
      longURL: req.body.longURL,
      userID: user_id
    }; 
    res.redirect("/urls");
  } else {
    res.status(401).send('Not authorized to edit this URL.');
  }
});

// deletes an existing url from the urlDatabase object
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session.user_id;
  const creator = urlDatabase[req.params.shortURL].userID;

  if (user_id === creator) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.status(401).send('Not authorized to delete this URL.');
  }
});

// registers a new user to users database 
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password){
    res.status(400).send('Password and email are required to register.')
  } else {
    if (getUserByEmail(email, users)) {
      res.status(400).send('User already exists.')
    } else {
      const randomId = generateRandomString();

      users[randomId] = {
        id: randomId,
        email: email,
        password: bcrypt.hashSync(password, 10)
      }

      req.session.user_id = randomId;
      res.redirect("/urls");
    }
  }
});

// checks for an existing user and logs them in
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = getUserByEmail(email, users);

  if (!user_id || !bcrypt.compareSync(password, users[user_id].password)) {
    res.status(403).send('Invalid credentials.')
  } else {
    req.session.user_id = user_id;
    res.redirect("/urls");
  }
});

// clears user_id cookie session 
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});