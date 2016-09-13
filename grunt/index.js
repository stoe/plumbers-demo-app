'use strict';

module.exports = (grunt) => {
  let fs = require('fs'),
    path = require('path'),
    configs = {};

  configs.availabletasks = {
    tasks: {}
  };

  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') {
      return;
    }

    let name = path.basename(file, '.js'),
      conf = require('./' + name);

    configs[name] = typeof conf === 'function' ? conf(grunt) : conf;
  });

  return configs;
};
