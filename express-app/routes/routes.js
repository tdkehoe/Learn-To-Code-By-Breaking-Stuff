var express = require('express');
var router = express.Router(); // Router with a capital 'R' is a mini-application

// var MongoClient = require('mongodb').MongoClient;
// var assert = require('assert');
// var ObjectID = require('mongodb').ObjectID;
// var url = 'mongodb://localhost:27017/test';
// MongoClient.connect(url, function(err, db){
//   assert.equal(null, err);
//   console.log("Connected correctly to server.");
//   db.close();
// });

router.get('/', function(request, response){
  response.render('home');
});

router.get('/about', function(request, response){
  response.render('about');
});

module.exports = router;
