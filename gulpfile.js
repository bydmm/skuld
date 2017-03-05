'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var webpack = require("webpack");
var path = require('path');
var gutil = require("gulp-util");

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

gulp.task("webpack", function(callback) {
    // run webpack
    webpack({
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: "commons",
          filename: "commons.js",
          minChunks: 2,
        }),
      ],
      entry: {
        site: "./src/js/site.js",
      },
      output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].bundle.js',
      }
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

var watcher = gulp.watch('./src/js/*.js', ['webpack']);
