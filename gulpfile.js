var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  runSequence = require('run-sequence');

var bailOnFail = !!process.env.CI;

gulp.task('lint', function () {
  var stream = gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));

  return bailOnFail ? stream.pipe(jshint.reporter('fail')).on('error', function (error) {
    console.error(error.message);
    process.exit(1);
  }) : stream;
});

gulp.task('test', function () {
  return gulp.src('./lib/*.spec.js', {read: false})
    .pipe(mocha())
    .on('error', function (error) {
      if (bailOnFail) {
        console.error(error.message);
        process.exit(1);
      }
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