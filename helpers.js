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
const getUserByEmail = function(email, users) {
  for (const id in users) {
    if (users[id].email === email) {
      return id;
    }
  }
  return undefined;
};

// creates a new object with specific users urls
const urlsForUser = function(id, database) {
  const userUrls = {};

  for (const url in database){
    if (id === database[url].userID) {
      userUrls[url] = database[url];
    }
  } 
  return userUrls;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };