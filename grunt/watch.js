/**
 * Run predefined tasks whenever watched file patterns are added, changed or deleted
 *
 * @see https://www.npmjs.com/package/grunt-contrib-watch
 *
 * @returns {Object}
 */
'use strict';

module.exports = () => {
  let options = {
    spawn: false,
    reload: true
  };

  return {
    js: {
      files: [
        'bin/www',
        'grunt/**/*.js',
        'public/**/*.js',
        'routes/**/*.js',
        'spec/**/*.spec.js',
        'app.js',
        'Gruntfilejs'
      ],
      tasks: [
        'test'
      ],
      options: options
    }
  };
};
