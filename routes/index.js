'use strict';

let express = require('express');
let router = express.Router();

let pkg = require('../package.json');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    description: pkg.description
  });
});

module.exports = router;
