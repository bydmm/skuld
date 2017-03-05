'use strict';

module.exports = SkuldRequester;

function SkuldRequester(url, interval) {
  var request = require('request');
  var self = this;
  self.url = url;
  self.interval = interval;

  this.start = function() {
    self.errors = [];
    self.requestCount = 0;
    self.successCount = 0;
    self.startAt = Math.round((new Date()).getTime() / 1000);
    self.intervalTimer = setInterval(self.sendRequest, interval);
  }

  this.stop = function() {
    clearInterval(self.intervalTimer);
  }

  this.currentFeed = function() {
    var currentTime = Math.round((new Date()).getTime() / 1000);
    return {
      duration: currentTime - self.startAt,
      requestCount: self.requestCount,
      successCount: self.successCount,
      errorCount: self.errors.length
    }
  }

  this.sendRequest = function() {
    var thisTime = self.requestCount;
    request(
      self.url + '?requestTime=' + thisTime,
      {pool: {maxFreeSockets: Infinity, maxSockets: Infinity},
      timeout: 30000},
      function (err, response, body) {
        if (err) {
          self.errors.push(err.code);
        }else {
          if (response.statusCode != 200) {
             // console.log(response.statusCode);
             // console.log(response);
             self.errors.push(response.statusCode);
          } else {
            self.successCount++;
          }
        }
    });
    self.requestCount++;
  }
}

// var r = new SkuldRequester('http://127.0.0.1/pdf/pdf.html', 1);
// r.start();

// setInterval(function() {
//   console.log(r.currentFeed());
// }, 1000);

// var d = new Date();
// var start_at = d.getTime();
// var requestTime = 0;
// var successCount = 0;
// var errors = [];

// var request = require('request');

// function send_request() {
//   var thisTime = requestTime;
//   request('http://frigate-bird-dev.pathsource.com/api/videos/recommend?requestTime=' + thisTime, {pool: {maxFreeSockets: Infinity, maxSockets: Infinity}, timeout: 30000}, function (err, response, body) {

//     if (err) {
//       errors.push(err.code);
//     }else {
//       if (response.statusCode != 200) { console.log(response.statusCode) };
//       if (response.statusCode != 200) { console.log(response) };
//       successCount++;
//     }
//   });
//   requestTime++;
// }

// function onlyUnique(value, index, self) {
//   return self.indexOf(value) === index;
// }

// var timer = setInterval(function(){
//   for (var i = 1; i <= 500; i++) {
//     send_request();
//   };
// }, 1000);

// setTimeout(function(){
//   clearInterval(timer);
// }, 30000);

// setTimeout(function(){
//   console.log(errors.filter( onlyUnique ))
// }, 60000);

// setInterval(function(){
//   var d = new Date();
//   var t = d.getTime(); // start_at
//   console.log('Cost:' + (t - start_at) / 1000);
//   console.log('requestTime:' + requestTime);
//   console.log('successCount:' + successCount);
// }, 1000);

