const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 8080; 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// renders an index of all urls in the url database
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls-index", templateVars);
});

// adds a new url to the database and generates a new short url
app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.send("Ok"); // Respond with 'Ok' (we will replace this);
});

// renders the new url submission page
app.get("/urls/new", (req, res) => {
  res.render("urls-new");
});

// redirects to the long url based on the short url 
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

// lists the short url and its corrisponding long url
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls-show", templateVars);
});

 app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});


// Potentially not needed:
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
//  });
 
//  app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
//  });