var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    size = require('gulp-size'),
    gzip = require('gulp-gzip'),
    notify = require("gulp-notify"),
    uncss = require('gulp-uncss');


// Server
gulp.task('express', function() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')({port: 4002}));
	app.use(express.static(__dirname));
	app.listen(4000);
});

// Livereload
var tinylr;
gulp.task('livereload', function() {
	tinylr = require('tiny-lr')();
	tinylr.listen(4002);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

// SCSS
gulp.task('styles', function() {
	return gulp.src('grid.scss')
	// error handling
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sass({ style: 'expanded' }))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
	.pipe(gulp.dest('css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('css'))
  .pipe(size({gzip: false, showFiles: true}))
	.pipe(size({gzip: true, showFiles: true}))

	.pipe(notify("SCSS minified"));
});

// Watch
gulp.task('watch', function() {
	gulp.watch('*.scss', ['styles']);
	gulp.watch('*.html', notifyLiveReload);
	gulp.watch('css/*.css', notifyLiveReload);
});

// Defaults
gulp.task('default', ['styles', 'express', 'livereload', 'watch'], function() {});
