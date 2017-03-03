'use strict';

var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname + '/logs', 'access.log'), {flags: 'a'});
// setup the logger
app.use(morgan('dev', {stream: accessLogStream}));

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(5000, function () {
  console.log('Server running on port 5000!');
});