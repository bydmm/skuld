'use strict';
import $ from 'jquery';
import io from 'socket.io-client';
import * as d3 from "d3";

var socket = io('http://localhost:5000');
var chart = {};

socket.on('feed', function (data) {
  console.log(data);
  chart.tick(data);
});

socket.on('connect', function(){
  console.log('socket connect');
});

socket.on('disconnect', function(){
  console.log('disconnect');
});

$('#js-start').click(function(){
  var interval = parseInt($('#js-interval').val());
  $('#js-graph').html('');
  chart = new Chart(interval);
  var url = $('#js-url').val();
  socket.emit('start', {url: url, interval: interval});
});

$('#js-stop').click(function(){
  socket.emit('stop');
});

function Chart(interval) {
  var width = 500;
  var height = 200;
  var limit = 60 * 1;
  var duration = 750;
  var now = new Date(Date.now() - duration);

  var groups = {
    requestCount: {
      value: 0,
      color: 'blue',
      data: d3.range(limit).map(function() {
        return 0
      })
    },
    successCount: {
      value: 0,
      color: 'green',
      data: d3.range(limit).map(function() {
        return 0
      })
    },
    errorCount: {
      value: 0,
      color: 'red',
      data: d3.range(limit).map(function() {
        return 0
      })
    }
  }

  var x = d3.time.scale()
      .domain([now - (limit - 2), now - duration])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, 1000 / interval * 60])
      .range([height, 0]);

  var line = d3.svg.line()
      .interpolate('basis')
      .x(function(d, i) {
          return x(now - (limit - 1 - i) * duration)
      })
      .y(function(d) {
          return y(d)
      });

  var svg = d3.select('#js-graph').append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height + 50)

  var axis = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

  var paths = svg.append('g')

  for (var name in groups) {
      var group = groups[name]
      group.path = paths.append('path')
          .data([group.data])
          .attr('class', name + ' group')
          .style('stroke', group.color)
  }

  this.tick = function(data) {
    now = new Date();

    // Add new values
    for (var name in groups) {
        var group = groups[name];
        group.data.push(data[name]);
        group.path.attr('d', line);
    }

    // Shift domain
    x.domain([now - (limit - 2) * duration, now - duration])

    // Slide x-axis left
    axis.transition()
        .duration(duration)
        .ease('linear')
        .call(x.axis)

    // Slide paths left
    paths.attr('transform', null)
        .transition()
        .duration(duration)
        .ease('linear')
        .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')

    // Remove oldest data point from each group
    for (var name in groups) {
        var group = groups[name]
        group.data.shift()
    }
  }
}


