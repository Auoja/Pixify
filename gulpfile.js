var gulp = require('gulp');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');

var browserSync = require('browser-sync')

var scriptPaths = './src/*.js';

gulp.task('browser-sync', function() {
    browserSync({
        open: false,
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('build', function() {
    gulp.src(scriptPaths)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('pixify.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['build', 'browser-sync'], function() {
    gulp.watch(scriptPaths, ['build', browserSync.reload]);
});