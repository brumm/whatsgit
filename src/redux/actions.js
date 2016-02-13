import all from 'promise-all'
import { createAction } from 'redux-actions'
import { hashHistory } from 'react-router'

import {
  user,
  search,
  comments,
  createComment,
  get,
  notifications,
  issue,
  editIssue,
  merge
} from '../utils/api'
window.get = get

import makeId from '../utils/makeId'
import arrayToObject from '../utils/arrayToObject'
import objectToArray from '../utils/objectToArray'
import filterIssues from '../utils/filterIssues'
import getRepo from '../utils/getRepo'

export const setFilters         = createAction('SET_FILTERS')
export const setIssues          = createAction('SET_ISSUES')
export const setUser            = createAction('SET_USER')
export const setComments        = createAction('SET_COMMENTS')
export const setLoggedIn        = createAction('SET_LOGGED_IN')
export const setDefaultFilterId = createAction('SET_DEFAULT_FILTER_ID')
export const setNotifications   = createAction('SET_NOTIFICATIONS')

export const setIssue = createAction('SET_ISSUE',
(issue, id) => ({
  [id]: issue
})
)

export const createFilter = createAction('CREATE_FILTER',
  (filter, id=makeId()) => ({
    [id]: filter
  })
)

export const createFilterOutputCache = createAction('CREATE_FILTER_OUTPUT_CACHE',
  (output, id) => ({
    [id]: output
  })
)

export const createFilterAndCreateFilterOutputCache = (filter, id=makeId()) => (
  (dispatch, getState) => {
    let issues = filterIssues(getState().issues, filter.query)
    let issueIds = objectToArray(issues)
      .sort((a, b) => a.score < b.score ? 1 : -1)
      .sort((a, b) => a.updated_at < b.updated_at ? 1 : -1)
      .map(({id}) => id)

    dispatch(createFilter(filter, id))
    dispatch(createFilterOutputCache(issueIds, id))
  }
)


export const getUser = () => (
  (dispatch, getState) => (
    user()
      .then(user => {
        dispatch(setUser(user))
        dispatch(setLoggedIn(true))
        dispatch(appBootstrap())
      })
  )
)

export const appBootstrap = window.appBootstrap = () => (
  (dispatch, getState) => (
    user()
      .then(user => {
        dispatch(setFilters({}))
        dispatch(getNotifications())
        dispatch(getIssues(user.login))
          .then(() => {
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Open Issues',    query: { state: 'open', pull_request: { $exists: false } } }, getState().defaultFilterId))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Open PRs',       query: { state: 'open', pull_request: { $exists: true } } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Closed Issues',  query: { state: 'closed', pull_request: { $exists: false } } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Closed PRs',     query: { state: 'closed', pull_request: { $exists: true } } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Private Repos',  query: { access: 'private' } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Public Repos',   query: { access: 'public' } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Assigned to me', query: { 'assignee.login': user.login } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Created by me',  query: { 'user.login': user.login } }))
            dispatch(createFilterAndCreateFilterOutputCache({ type: 'default', name: 'Participating',  query: { $nor: [ {'user.login': user.login}, {'assignee.login': user.login} ] } }))
          })
      })
  )
)

export const getIssues = (username) => (
  (dispatch, getState) => (

    all({
      privateIssues: search(`involves:${username} is:private`),
      publicIssues: search(`involves:${username} is:public`)
    })
    .then(({privateIssues, publicIssues}) => {

      privateIssues = arrayToObject(privateIssues, issue => {
        let [owner, repo] = getRepo(issue.html_url)
        return { owner, repo, access: 'private' }
      })

      publicIssues = arrayToObject(publicIssues, issue => {
        let [owner, repo] = getRepo(issue.html_url)
        return {
          owner,
          repo,
          access: 'public'
        }
      })

      dispatch(setIssues({
        ...privateIssues,
        ...publicIssues
      }))
    })
  )
)

// export const getIssue = (issueId) => (
//   (dispatch, getState) => {
//     const {number, owner, repo} = getState().issues[issueId]
//     return issue(owner, repo, number)
//       .then(issue => dispatch(setIssue(issue, issueId)))
//   }
// )

export const getComments = (issueId) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]

    return comments(owner, repo, number)
      .then(comments => dispatch(setComments({
        [issueId]: comments
      })))
  }
)

export const getNotifications = () => (
  (dispatch, getState) => {
    return notifications()
      .then(notifications => dispatch(setNotifications(notifications)))
  }
)

export const postComment = (issueId, body) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]
    return createComment(owner, repo, number, body)
      .then(notifications => dispatch(
        getComments(issueId)
      ))
  }
)

export const closeIssue = (issueId) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]
    return editIssue(owner, repo, number, { state: 'closed' })
      .then(issue => dispatch(
        setIssue({
          ...getState().issues[issueId],
          ...issue
        }, issueId)
      ))
  }
)

export const openIssue = (issueId) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]
    return editIssue(owner, repo, number, { state: 'opened' })
      .then(issue => dispatch(
        setIssue({
          ...getState().issues[issueId],
          ...issue
        }, issueId)
      ))
  }
)
