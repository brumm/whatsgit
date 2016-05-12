import all from 'promise-all'
import { createAction } from 'redux-actions'

import * as ghApi from '../utils/api'

import makeId        from '../utils/makeId'
import arrayToObject from '../utils/arrayToObject'
import objectToArray from '../utils/objectToArray'
import getRepo       from '../utils/getRepo'
import filterIssues  from '../utils/filterIssues'

export const setFilters         = createAction('SET_FILTERS')
export const setIssues          = createAction('SET_ISSUES')
export const setUser            = createAction('SET_USER')
export const setComments        = createAction('SET_COMMENTS')
export const setEvents          = createAction('SET_EVENTS')
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
    [id]: {
      count: 0,
      matchedIssues: [],
      ...filter
    }
  })
)

export const getUser = () => (
  (dispatch, getState) => (
    ghApi.getUser()
      .then(user => {
        if (process.env.DEV === undefined) {
          Raven.setUserContext({
            email: user.email,
            login: user.login
          })
        }
        dispatch(setUser(user))
        dispatch(setLoggedIn(true))
        dispatch(appBootstrap())
      })
  )
)

export const refreshData = () => (
  (dispatch, getState) => {
    dispatch(getNotifications())
    dispatch(getIssues(getState().user.login))
    Object.keys(getState().comments).forEach(issueId => dispatch(getComments(issueId)))
    Object.keys(getState().events).forEach(issueId => dispatch(getEvents(issueId)))
  }
)

export const appBootstrap = window.appBootstrap = () => (
  (dispatch, getState) => (
    ghApi.getUser()
      .then(user => {
        dispatch(createFilter({ type: 'default', name: 'Open Issues',    query: { state: 'open', pull_request: { $exists: false } } }, getState().defaultFilterId))
        dispatch(createFilter({ type: 'default', name: 'Open PRs',       query: { state: 'open', pull_request: { $exists: true } } }))
        dispatch(createFilter({ type: 'default', name: 'Closed Issues',  query: { state: 'closed', pull_request: { $exists: false } } }))
        dispatch(createFilter({ type: 'default', name: 'Closed PRs',     query: { state: 'closed', pull_request: { $exists: true } } }))
        dispatch(createFilter({ type: 'default', name: 'Private Repos',  query: { access: 'private' } }))
        dispatch(createFilter({ type: 'default', name: 'Public Repos',   query: { access: 'public' } }))
        dispatch(createFilter({ type: 'default', name: 'Assigned to me', query: { 'assignee.login': user.login } }))
        dispatch(createFilter({ type: 'default', name: 'Created by me',  query: { 'user.login': user.login } }))
        dispatch(createFilter({ type: 'default', name: 'Participating',  query: { $nor: [ {'user.login': user.login}, {'assignee.login': user.login} ] } }))
        dispatch(getNotifications())
        dispatch(getIssues(user.login))
      })
  )
)

export const updateFilters = (username) => (
  (dispatch, getState) => {
    let { filters, issues } = getState()
    objectToArray(filters).forEach(filter => {
      let matchedIssues = Object.keys(filterIssues(issues, filter.query))
      dispatch(createFilter({
        ...filter,
        count: matchedIssues.length,
        matchedIssues
      }, filter.id))
    })
  }
)

export const getIssues = (username) => (
  (dispatch, getState) => (

    all({
      privateIssues: ghApi.issueSearch(`involves:${username} is:private`),
      publicIssues: ghApi.issueSearch(`involves:${username} is:public`)
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
      dispatch(updateFilters())
    })
  )
)

export const getEvents = issueId => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]

    return ghApi.issueEvents(owner, repo, number)
      .then(events => dispatch(setEvents({
        [issueId]: events
      })))
  }
)
export const getComments = (issueId) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]

    return ghApi.issueComments(owner, repo, number)
      .then(comments => dispatch(setComments({
        [issueId]: comments
      })))
  }
)

export const getNotifications = () => (
  (dispatch, getState) => {
    return ghApi.getNotifications()
      .then(notifications => {
        notifications = arrayToObject(notifications)
        dispatch(setNotifications(notifications))
      })
  }
)

export const postComment = (issueId, body) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]
    return ghApi.createComment(owner, repo, number, body)
      .then(notifications => dispatch(
        getComments(issueId)
      ))
  }
)

export const closeIssue = (issueId) => (
  (dispatch, getState) => {
    const {number, owner, repo} = getState().issues[issueId]
    return ghApi.editIssue(owner, repo, number, { state: 'closed' })
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
    return ghApi.editIssue(owner, repo, number, { state: 'opened' })
      .then(issue => dispatch(
        setIssue({
          ...getState().issues[issueId],
          ...issue
        }, issueId)
      ))
  }
)
