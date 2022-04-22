const { assert, expect } = require('chai');

const { generateRandomString, getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testDatabase = {
  URL1: { longURL: "http://www.lighthouselabs.ca", userID: "user1" },
  URL2: { longURL: "https://www.google.ca", userID: "user2" },
  URL3: { longURL: "http://netflix.com", userID: "user1" },
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const userID = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";

    assert.strictEqual(userID, expectedUserID, "userID does not equal expectedUserID");
  });

  it('should return undefined with invalid email', function() {
    const userID = getUserByEmail("test@test.com", testUsers)
    const expectedUserID = undefined;

    assert.strictEqual(userID, expectedUserID, "userID does not equal expectedUserID");
  });
});


describe('urlsForUser', function() {
  it('should return object of urls created by user', function() {
    const usersUrls = urlsForUser("user2", testDatabase)
    const expectedUrls = { URL2: { longURL: "https://www.google.ca", userID: "user2" } }

    expect(usersUrls).to.eql(expectedUrls);
  });

  it('should return and empty object if there are no urls created by user', function() {
    const usersUrls = urlsForUser("user3", testDatabase)
    const expectedUrls = {};

    expect(usersUrls).to.eql(expectedUrls);
  });
});


describe('generateRandomString', function() {
  it('should return a random 6 character alphanumeric string', function() {
    const randomString = generateRandomString().length;
    const expectedLength = 6;

    assert.strictEqual(randomString, expectedLength, "randomString length is not 6 characters");
  });
});