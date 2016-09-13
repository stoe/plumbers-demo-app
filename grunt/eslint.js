/**
 * Validate files with ESLint
 *
 * @see https://www.npmjs.com/package/gruntify-eslint
 *
 * @returns {Object}
 */
 'use strict';

module.exports = () => {
  let options = {
    configFile: '.eslintrc',
    rulePaths: []
  };

  return {
    grunt: {
      options: options,
      src: [
        'Gruntfile.js',
        'grunt/*.js'
      ]
    },
    spec: {
      options: options,
      src: [
        'spec/**/*.spec.js'
      ]
    },
    js: {
      options: options,
      src: [
        'bin/www',
        'public/**/*.js',
        'routes/**/*.js',
        'app.js',
      ]
    }
  };
};
