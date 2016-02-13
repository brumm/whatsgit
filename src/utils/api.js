import superagent from 'superagent'

function request(method, url, params) {
  const TOKEN = localStorage.getItem('token')
  return new Promise((resolve, reject) => {
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

export function post(url, params) {
  return request('post', url, params)
}

export function put(url, params) {
  return request('put', url, params)
}

export function patch(url, params) {
  return request('patch', url, params)
}

export function get(url, params) {
  return request('get', url, params)
}

export function search(query) {
  return get('/search/issues', {
    q: query,
    per_page: 100
  }).then(body => body.items)
}

export function comments(owner, repo, number) {
  return get(`/repos/${owner}/${repo}/issues/${number}/comments`)
}

export function createComment(owner, repo, number, body) {
  return post(`/repos/${owner}/${repo}/issues/${number}/comments`, {body})
}

export function editIssue(owner, repo, number, body) {
  return patch(`/repos/${owner}/${repo}/issues/${number}`, body)
}

export function issue(owner, repo, number) {
  return get(`/repos/${owner}/${repo}/issues/${number}`)
}

export function user() {
  return get('/user')
}

export function notifications() {
  return get('/notifications')
}

export function merge(owner, repo, number) {
  return put(`/repos/${owner}/${repo}/pulls/${number}/merge`)
}
