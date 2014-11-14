var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    to5 = require('gulp-6to5'),
    del = require('del');

var path = {};
path.src = './src';
path.lib = './lib';
path.js = path.src + '/**.js';

gulp.task('clean', function(cb) {
    return del(path.lib, cb);
});

gulp.task('build', ['clean'], function() {
    return gulp.src(path.js)
        .pipe(plumber())
        .pipe(to5({
        }))
        .pipe(gulp.dest(path.lib));
});

gulp.task('watch', function() {
    watch({ glob: path.js }, ['build']);
});

gulp.task('default', ['clean', 'build']);
gulp.task('dev', ['default', 'watch']);
