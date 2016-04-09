var gulp = require('gulp')
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso');

function convertSASStoCSS() {
    return gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(concat('styles.css'))
        .pipe(csso())
        .pipe(gulp.dest('dist'));
}

function processJs() {
    return gulp.src(['src/**/*.module.js', 'src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest('dist'));
}

gulp.task('sass', convertSASStoCSS);
gulp.task('js', processJs);
gulp.task('build', ['sass', 'js']);