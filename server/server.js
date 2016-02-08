
require('with-env')()

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

var githubToken = require('github-token')({
  githubClient: process.env.GITHUB_CLIENT_ID,
  githubSecret: process.env.GITHUB_CLIENT_SECRET,
  baseURL: 'http://localhost:3030/',
  callbackURI: '/callback',
  scope: ['user', 'repo']
});

require('http').createServer(function(req, res) {
  if (req.url.match(/login/)) {
    return githubToken.login(req, res);
  }

  if (req.url.match(/callback/)) {
    return githubToken.callback(req, res)
      .then(function(token) {
        console.log(token);
        res.writeHead(302, {
          'Location': 'http://localhost:3030/?token=' + token.access_token
        });
        res.end();
      });
  }

}).listen(3030);
