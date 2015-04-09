module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['browserify', 'jasmine'],
    plugins:[
      'karma-jasmine',
      'karma-coverage',
      'karma-junit-reporter',
      'karma-phantomjs-launcher',
      'karma-browserify'
    ],
    reporters: ['coverage'],
    files: [
      'unit/**/*.spec.js'
    ],
    browserify: {
      debug: true,
      transform: ['browserify-shim' ]
    }
  });
};
