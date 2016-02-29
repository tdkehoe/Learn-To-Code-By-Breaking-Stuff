var express = require('express');
var app = express();

var routes = require('./routes/routes');
app.use('/', routes);

app.set('view engine', 'hbs');

app.use(express.static('./public'));

app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");
