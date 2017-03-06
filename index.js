'use strict';

var url = require('url');
var fs = require('fs');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var app = express();
var http = require('http');
var server = http.createServer(app);
// Init socketIo
var socketIo = require('socket.io');
var io = socketIo();
io.attach( server );

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname + '/logs', 'access.log'), {flags: 'a'});
// setup the logger
app.use(morgan('dev', {stream: accessLogStream}));

app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.get('/', function (req, res) {
  res.render('index');
});

server.listen(5000, function(){
  console.log('Express server listening on port ' + 5000);
});

io.on('connection', function (socket) {
  var skuldRequester = require('./skuld_requester.js');
  var r = {};

  var feedTimer = {};

  socket.on('start', function (data) {
    r = new skuldRequester(data.url, data.interval);
    r.start();
    console.log('start');
    var refresh = data.interval < 20 ? 20 : data.interval;
    feedTimer = setInterval(function(){
      socket.emit('feed', r.currentFeed());
    }, refresh);
  });

  socket.on('stop', function (data) {
    stop();
    console.log('stop');
  });

  socket.on('disconnect', function(){
    stop();
  });

  function stop() {
    if (typeof(r.stop) != 'undefined') {
      clearInterval(feedTimer);
      r.stop();
    }
  }
});
