/* jshint node:true */
'use strict';
var
  gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  browserify = require('browserify'),
  path = require('path'),
  runSequence = require('run-sequence'),
  revall = require('gulp-rev-all'),
  templateCache = require('gulp-angular-templatecache'),
  source = require('vinyl-source-stream'),
  argv = require('yargs').argv,
  nib = require('nib'),
  production = argv.staging || process.env.ENVIRONMENT === 'staging' ? false : true,
  karma = require('karma').server;

gulp.task('styles', function () {
  return gulp.src('app/styles/main.css')
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function () {
  return gulp.src([
    'app/scripts/**/*.js',
    '!app/scripts/bundle.min.js',
    '!app/scripts/templates.js',
    '!app/scripts/external/**/*.js'
  ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: '{.tmp,app}'});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/styles/fonts'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', function () {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({port: 35729}))
    .use(serveStatic('.tmp'))
    .use(serveStatic('app'))
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
    .use(serveIndex('app'));

  require('http').createServer(app)
    .listen(9000)
    .on('listening', function () {
      console.log('Started connect web server on http://localhost:9000');
    });
});

gulp.task('serve', ['connect', 'watch'], function () {
  require('opn')('http://localhost:9000');
});

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['browserify', 'connect'], function () {
  $.livereload.listen();

  // watch for changes
  gulp.watch([
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    '!app/scripts/**/*.min.js',
    '!app/scripts/**/templates.js',
    'app/images/**/*'
  ]).on('change', $.livereload.changed);

  gulp.watch('app/styles/**/*.css', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
});


gulp.task('build-app', function (callback) {
  runSequence(
    'clean',
    'browserify',
    'build',
    'rev',
    'minify-html',
    callback
  );
});

gulp.task('build', ['html', 'images', 'fonts', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('browserify', ['build-styles', 'app-config', 'cache-templates'], function () {

  var bundleStream = browserify({
    entries: ['./app/scripts/main.js'],
    debug: true
  }).bundle();

  bundleStream
    .pipe(source('bundle.min.js'))
    .pipe(production ? $.streamify($.uglify()) : $.util.noop())
    // Output it to our dist folder
    .pipe(gulp.dest('app/scripts/'))
    .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('cache-templates', function () {
  return gulp.src([
    './app/scripts/**/*.html'
  ])
    .pipe(templateCache({
      moduleSystem: 'Browserify',
      root: '/scripts/',
      standalone: true
    }))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('rev', function () {
  return gulp.src('dist/**/*.{js,css,png,jpg,jpeg,gif,ico,html,woff,ttf,eot,svg}')
    .pipe(revall({
      transformFilename: function (file, hash) {
        var ext = path.extname(file.path);
        if (ext === '.html') {
          return path.basename(file.path, ext) + ext;
        }
        return hash.substr(0, 8) + '.'  + path.basename(file.path, ext) + ext; // 34asd10c.filename.ext
      },
      prefix: ''
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify-html', function () {
  var opts = {
    conditionals: true,
    spare: true,
    empty: true,
    cdata: true
  };

  return gulp.src('dist/**/*.html')
    .pipe($.minifyHtml(opts))
    .pipe(gulp.dest('dist/'));
});

gulp.task('app-config', function () {
  var src = ['app/scripts/config/base.json'];

  if (!production) {
    src.push('app/scripts/config/debug.json');
  }
  return gulp.src(src.concat('bower.json'))
    .pipe($.extend('app.json'))
    .pipe(gulp.dest('app/scripts/config'));
});

gulp.task('build-styles', function () {
  return gulp.src('app/styles/main.styl')
    .pipe($.stylus({
      compress: true,
      'include css': true,
      use: [nib()]
    }))
    .pipe(gulp.dest('app/styles'));
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true
  }, done);
});
