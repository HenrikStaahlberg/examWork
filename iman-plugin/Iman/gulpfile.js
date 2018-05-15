var gulp = require('gulp');
var concat = require('gulp-concat');
var streamqueue  = require('streamqueue');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('build', function() {
   return streamqueue({objectMode: true},
        gulp.src('./dist/inline.bundle.js', {base: './dist/'}),
        gulp.src('./dist/styles.bundle.js', {base: './dist/'}),
        gulp.src('./dist/vendor.bundle.js', {base: './dist/'}),
        gulp.src('./dist/main.bundle.js', {base: './dist/'})
   )
        .pipe(concat('iman.js'))
        .pipe(gulp.dest('c://Meridix/webapp/plugins-client/'));
});

gulp.task('copyMani', function() {
    return gulp
      .src('./manifest.ini')
      .pipe(gulp.dest('c://Meridix/webapp/plugins-client/'))
})