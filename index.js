// The API toolkit for making REST systems easily
const express = require('express');
// A good solution for handling JSON data in routes
const bodyParser = require('body-parser');
// Node JS modules for filesystem access
const fs = require('fs');

// Pull our ID generation logic from a module
const generateId = require('./id-gen');

// This is a JSON object of a single programmer
const user = require('./programmers.json');

// We must have our single programmer for a model "schema"
if (!fs.existsSync('./programmers.json')) {
  throw new Error('Could not find database of programmers!');
}

const db = require('./database');

// Our actual database will live here, and be modified as needed
let database = [user];

// Very trivial body parsing, taking in the existing user from
// file and only accepting the keys provided, dropping any
// extra. This does not go deeply nested.

const userAttrs = Object.keys(user);

function parseJsonBody(body) {
  return userAttrs.reduce((total, key) => {
    total[key] = body[key];
    return total;
  }, {});
}


// Make an instance of our express application
const app = express();
// Specify our > 1024 port to run on
const port = 3000;


// Apply our middleware so our code can natively handle JSON easily
app.use(bodyParser.json());


// Standard way of returning an error to the requester
function errorMessage(message, status, res) {
  res.status(status).json({ errors: [message]});
}

// Find a user by SID, returns undefined if not present
function find(id) {
  return database.find(u => u.SID === id);
}

// Build our routes

app.get('/', (req, res) => {
  res.json(database);
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  const user = find(id);

  !!user ? res.json(user) : errorMessage(`Not found for id of: ${id}`, 404, res);
});

app.put('/:id', (req, res) => {
  const id = req.params.id;
  const user = find(id);

  if(!user) {
    errorMessage(`Not found for id of: ${id}`, 404, res);
    return;
  }

  const body = parseJsonBody(req.body);

  database = database.map(user => user.SID === id ? Object.assign({}, user, body) : user);

  res.send("Updated Successfully");
});

app.post('/', (req, res) => {
  const body = parseJsonBody(req.body);

  body["SID"] = generateId();

  database = database.concat(body);

  res.status(201).json(body);
});

// Catch all get requests and return 404
app.get('*', (req, res) => {
  errorMessage(`Route not found`, 404, res);
})


app.listen(port, () => {
  console.log(`She's alive on port ${port}`);
});

