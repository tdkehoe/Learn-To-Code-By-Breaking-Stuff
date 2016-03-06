var express = require('express'); // connects Express
var app = express(); // connects Express

app.set('view engine', 'hbs'); // set the view engine to Handlebars

app.use(express.static('./public')); // middleware that serves static files

var routes = require('./routes/routes.js'); // connects routes.js
app.use('/', routes); // middleware to serve routes

app.listen(3000); // starts server
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");
