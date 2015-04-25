var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  runSequence = require('run-sequence');


gulp.task('lint', function () {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', function () {
  return gulp.src('./lib/*.spec.js', {read: false})
    .pipe(mocha())
    .on('error', function () {
      this.emit('end');
    });
});

gulp.task('build', function (done) {
  runSequence(
    'lint',
    'test',
    done
  );
});

gulp.task('watch', function () {
  gulp.watch('./lib/*.js', ['build']);
});

gulp.task('default', function (done) {
  require('run-sequence')(
    'build',
    'watch',
    done
  );
});