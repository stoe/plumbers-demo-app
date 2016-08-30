'use strict';

let express = require('express');
let router = express.Router();
let GitHubApi = require('github');

const utf8 = require('utf8');
const chalk = require('chalk');
const gh = require('../github-client.json');
const pkg = require('../package.json');

// define the GitHub client
const client = new GitHubApi({
  debug: true,
  headers: {
    'user-agent': gh.USER_AGENT,
    accept: 'application/vnd.github.squirrel-girl-preview'
  },
  Promise: require('bluebird')
});

// authenticate
client.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_TOKEN
});

/**
 *
 * @param res
 */
function doNothing(res) {
  // <debug>
  // console.log('\n-----\n');
  // console.log(chalk.red('do nothing'));
  // console.log('\n-----\n');
  // </debug>

  res.sendStatus(204);
}

/**
 *
 * @param error
 */
function sendErrorResponse(error) {
  // <debug>
  // console.log('\n-----\n');
  // console.log(chalk.red('ERROR'), error);
  // console.log('\n-----\n');
  // </debug>

  this.sendStatus(500);
}

/**
 *
 * @param commits
 * @param user
 * @param repo
 * @param comment
 * @param res
 */
function setStatusFromComment(commits, user, repo, comment, res) {
  let isPlusOne = (utf8.encode(comment.body).indexOf('\xF0\x9F\x91\x8D')) > -1 || (comment.body.indexOf(':+1') > -1),
    state = (isPlusOne ? 'success' : 'pending');

  let options = {
    user: user,
    repo: repo,
    sha: commits[0].sha,
    state: state,
    context: pkg.name,
    // description: pkg.name,
  };

  // <debug>
  console.log(chalk.yellow('setStatusFromComment:options'), options);
  // </debug>

  client.repos.createStatus(options).then(() => {
    res.sendStatus(200);
  }).catch(sendErrorResponse.bind(res));

}

// GET method route
router.get('/', (req, res) => {
  res.send(403);
});

// POST method route
router.post('/', (req, res) => {
  let body = req.body,
    action = body.action || null;

  // exit early
  if (!action) {
    doNothing(res);
    return;
  }

  // <debug>
  // console.log('\n-----\n');
  // console.log(chalk.yellow('body'), body);
  // console.log('\n-----\n');
  // </debug>

  // api needed data
  let repo = body.repository.name;

  // booleans
  let isPR = !!body && body.pull_request,
    isComment = body && body.comment;

  // action types
  let triggerActions = [
      'opened', 'reopened', 'edited', 'synchronized'
    ],
    ignoreActions = [
      'closed', 'assigned', 'unassigned', 'labeled', 'unlabeled'
    ];

  if (isPR && !ignoreActions.includes(action) && triggerActions.includes(action)) {

    // *** Pull Requests & Commits ***

    // <debug>
    // console.log('\n-----\n');
    // console.log(chalk.yellow('PR'));
    // console.log('\n-----\n');
    // </debug>

    let pr = body.pull_request,
      user = pr.user.login,
      sha = pr.head.sha;

    let options = {
      user: user,
      repo: repo,
      sha: sha,
      state: 'pending',
      context: pkg.name,
      // description: pkg.name,
    };

    // <debug>
    console.log(chalk.yellow('setStatusFromCommit:options'), options);
    // </debug>

    client.repos.createStatus(options).then(() => {
      res.sendStatus(200);
    }).catch(sendErrorResponse.bind(res));

  } else if (isComment && triggerActions.includes(action)) {

    // *** Comments ***

    // <debug>
    // console.log('\n-----\n');
    // console.log(chalk.yellow('COMMENT'));
    // console.log('\n-----\n');
    // </debug>

    let comment = body.comment,
      issue = body.issue,
      user = issue.user.login,
      number = issue.number;

    client.pullRequests.getCommits({
      user: user,
      repo: repo,
      number: number,
      per_page: 1
    }).then((commits) => {
      if (client.hasNextPage(commits)) {
        // <debug>
        console.log(chalk.grey('get from last page'));
        // </debug>

        client.getLastPage(commits, (e, lastPageCommits) => {
          setStatusFromComment.call(null, lastPageCommits, user, repo, comment, res)
        });
      } else {
        // <debug>
        console.log(chalk.grey('get from current page'));
        // </debug>

        setStatusFromComment.bind(null, commits, user, repo, comment, res);
      }
    }).catch(sendErrorResponse.bind(res));

  } else {
    doNothing(res);
  }

});

module.exports = router;
