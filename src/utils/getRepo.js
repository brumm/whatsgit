
export default function getRepo(url) {
  let [match, user, repo] = url
    .replace('https://github.com/', '')
    .match(/^([0-9a-z-_\.]+)\/([0-9a-z-_\.]+)/i)
  return [user, repo]
}
