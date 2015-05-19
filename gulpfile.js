var gulp = require('gulp'),
  bump = require('gulp-bump'),
  git = require('gulp-git'),
  filter = require('gulp-filter'),
  tagVersion = require('gulp-tag-version'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  replace = require('gulp-replace'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
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

gulp.task('browser', function () {
  return gulp.src(['lib/fluent.js'])
    .pipe(replace('module.exports', 'globalCtx.fluent'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function (done) {
  runSequence(
    'lint',
    'test',
    'browser',
    done
  );
});

gulp.task('push:tags', function () {
  git.push('origin', 'master', {args: " --tags"}, function (err) {
    if (err) throw err;
  });
});

gulp.task('npm:publish', function (done) {
  var spawn = require('child_process').spawn;
  spawn('npm', ['publish'], {stdio: 'inherit'}).on('close', done);
});

function release(type, done) {
  gulp.task('bumpAndTag:' + type, function () {
    return gulp.src(['./package.json', './bower.json'])
      .pipe(bump({type: type}))
      .pipe(gulp.dest('./'))
      .pipe(git.commit('Release ' + type))
      .pipe(filter('package.json'))
      .pipe(tagVersion());
  });

  return runSequence(
    'bumpAndTag:' + type,
    'push:tags',
    'npm:publish',
    done
  );
}

gulp.task('release', release.bind(null, 'patch'));
gulp.task('release:minor', release.bind(null, 'minor'));
gulp.task('release:major', release.bind(null, 'major'));

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