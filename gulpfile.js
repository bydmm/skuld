'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('default', ['browser-sync'], function () {});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:5000",
        files: ["public/*.*", "views/*.*"],
        browser: "google chrome",
        port: 7000,
  });
});

gulp.task('nodemon', function (cb) {
  var started = false;

  return nodemon({
    script: 'index.js',
    ignore: ['public/', 'src/']
  }).on('start', function () {
    if (!started) {
      cb();
      started = true;
    }
  });
});