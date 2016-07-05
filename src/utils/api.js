import superagent from 'superagent'

function request(method, url, params={}) {
  const TOKEN = localStorage.getItem('token')
  return new Promise((resolve, reject) => {
    console.info('[api]', method, url, params);
    let req =
      superagent[method]('https://api.github.com' + url)
      [method === 'get' ? 'query' : 'send'](params)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')

    if (TOKEN) {
      req
        .set('Accept', 'application/vnd.github.v3+json')
        .set('Authorization', 'token ' + TOKEN)
    }
    req.end((error, response) => {
      if (error || !response || !response.ok) { reject(error || response) }
      else { resolve(response.body) }
    })
  })
}

// generic HTTP verbs

function post(url, params) {
  return request('post', url, params)
}

function put(url, params) {
  return request('put', url, params)
}

function patch(url, params) {
  return request('patch', url, params)
}

function get(url, params) {
  return request('get', url, params)
}

// github api

export function issueSearch(query) {
  return get('/search/issues', {
    q: query,
    per_page: 100
  }).then(body => body.items)
}

export function issueEvents(owner, repo, number) {
  return get(`/repos/${owner}/${repo}/issues/${number}/events`)
}

export function issueComments(owner, repo, number) {
  return get(`/repos/${owner}/${repo}/issues/${number}/comments`)
}

export function createComment(owner, repo, number, body) {
  return post(`/repos/${owner}/${repo}/issues/${number}/comments`, {body})
}

export function editIssue(owner, repo, number, body) {
  return patch(`/repos/${owner}/${repo}/issues/${number}`, body)
}

export function getIssue(owner, repo, number) {
  return get(`/repos/${owner}/${repo}/issues/${number}`)
}

export function getUser() {
  return get('/user')
}

export function getNotifications() {
  return get('/notifications').then(notifications => (
    notifications.map(notification => ({
      ...notification,
      issueNumber: notification.subject.url.match(/\d+$/)[0],
      threadId: notification.subscription_url.match(/(\d+)\/subscription$/)[1],
    }))
  ))
}
