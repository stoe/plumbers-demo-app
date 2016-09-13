/**
 * Run jasmine specs headlessly through PhantomJS
 *
 * @see https://www.npmjs.com/package/grunt-contrib-jasmine
 *
 * @returns {Object}
 */
'use strict';

module.exports = () => {
  return {
    projectRoot: './spec'
  };
};
