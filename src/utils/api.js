import superagent from 'superagent'

function request(method, url, params) {
  const TOKEN = localStorage.getItem('token')
  return new Promise((resolve, reject) => {
    let req =
      superagent[method](url)
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

export function get(url, params) {
  return request('get', url, params)
}

export function search(query) {
  return get('https://api.github.com/search/issues', {
    q: query,
    per_page: 100
  }).then(body => body.items)
}

export function comments(owner, repo, number) {
  return get(`https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`)
}

export function user() {
  return get('https://api.github.com/user')
}
