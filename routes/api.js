let express = require('express');
let router = express.Router();
let GitHubApi = require('github');

let pkg = require('../github-client.json');

// define the GitHub client
let client = new GitHubApi({
  debug: true,
  headers: {
    'user-agent': pkg.USER_AGENT
  },
  Promise: require('bluebird')
});

// authenticate
client.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});

// GET method route
router.get('/', (req, res) => {
  res.send(403);
});

// POST method route
router.post('/', (req, res) => {
  let body = req.body,
      zen  = body.zen,
      pr   = body ? body.pull_request : null,
      user, repo, sha;

  if (zen) {
    res.json({
      msg: 'I :green_heart: my Lederhos\'n.'
    });
    return;
  }

  // console.log('\n-----\n');
  // console.log('body', body);

  if (pr) {
    user = pr.user;
    repo = pr.repo;
    sha = pr.sha;

    console.log('\n-----\n');
    console.log('pr', pr);

    res.sendStatus(200);

    return;
  }

  res.sendStatus(204);
});

module.exports = router;
