var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var babelify = require('babelify');

gulp.task('scripts:buildIndex', function (){
  browserify(['js/main.js', 'js/dbhelper.js', './sw.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('index_bundle.js'))
    .pipe(gulp.dest('./build'))
})


gulp.task('scripts:buildRestaurants', function () {
  browserify(['js/restaurant_info.js', 'js/dbhelper.js', './sw.js'])
    .transform(babelify.configure({
      presets: ['env']
    }))
    .bundle()
    .pipe(source('restaurant_bundle.js'))
    .pipe(gulp.dest('./build'))
})
