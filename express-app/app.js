// var http = require('http');
var express = require('express');
var app = express();

app.set('view engine', 'hbs');
// app.set('views', './views');

app.use(express.static('./public'));

app.get('/', function(request, response){
  response.render('home');
});

app.get('/about', function(request, response){
  response.render('about');
});

// app.get('/', function(request, response){
//   response.send("<p>hello, world</p><p><a href='http://localhost:3000/about'>About</a></p>");
// });

// app.get('/about', function(request, response){
//   response.send("<p>I was born at a very young age.</p><p><a href='http://localhost:3000/'>Home</a></p>");
// });

// app.get('/test', function(request, response) {
//   response.send('this is a test');
// })

app.listen(3000);
console.log("Woot! Server started on localhost:3000; press Ctrl-C to terminate.");
