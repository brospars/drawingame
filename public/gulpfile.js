var gulp      = require('gulp'),
    rename    = require('gulp-rename'),     // Renommage des fichiers
    minifyCss = require('gulp-minify-css'), // Minify
    sass      = require('gulp-sass');       // Conversion des SCSS en CSS


// Sass → CSS
gulp.task('css', function() {
    return gulp.src('./stylesheets/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./css'));
});

// CSS → Min CSS
gulp.task('minify-css', function() {
  return gulp.src('./css/style.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./css/'));
});

gulp.task('watch', function() {
    gulp.watch('./stylesheets/*.scss', ['css']);
    gulp.watch('./css/*.css', ['minify-css']);
});

// Default Task
gulp.task('default', ['css', 'minify-css', 'watch']);