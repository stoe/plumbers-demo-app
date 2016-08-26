module.exports = function(grunt) {
  let config = require('./grunt')(grunt);

  config.pkg = grunt.file.readJSON('package.json');

  grunt.config.init(config);
  grunt.config.merge({
    availabletasks: {
      options: {
        filter: 'include',
        tasks: ['test', 'watch'],
        sort: ['default', 'test', 'watch']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('gruntify-eslint');

  grunt.registerTask('default', 'Shows the available tasks.', [
    'availabletasks'
  ]);

  // test
  grunt.registerTask('test', 'Run tests.', [
    'eslint', 'jasmine_node'
  ]);
};
