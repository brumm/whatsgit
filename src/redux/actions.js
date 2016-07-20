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
        return Promise.all([
          dispatch(setUser(user)),
          dispatch(setLoggedIn(true)),
          dispatch(appBootstrap()),
        ])
      })
  )
)

export const refreshData = () => (
  (dispatch, getState) => {
    // dispatch(getNotifications())
    return dispatch(getIssues())
      .then(() => dispatch(updateFilters()))
      .then(
        Promise.all([
          Object.keys(getState().comments).map(issueId => dispatch(getComments(issueId))),
          Object.keys(getState().events).map(issueId => dispatch(getEvents(issueId))),
        ])
      )
  }
)

const appBootstrap = () => (
  (dispatch, getState) => {
    let {user: { login }} = getState()

    dispatch(createFilter({ order: 1, type: 'filter', name: 'Open Issues',      query: { state: 'open', pull_request: { $exists: false } } }, getState().defaultFilterId))
    dispatch(createFilter({ order: 2, type: 'filter', name: 'Open PRs',         query: { state: 'open', pull_request: { $exists: true } } }))
    dispatch(createFilter({ order: 3, type: 'filter', name: 'Closed Issues',    query: { state: 'closed', pull_request: { $exists: false } } }))
    dispatch(createFilter({ order: 4, type: 'filter', name: 'Closed PRs',       query: { state: 'closed', pull_request: { $exists: true } } }))
    dispatch(createFilter({ order: 5, type: 'filter', name: 'Private Repos',    query: { access: 'private' } }))
    dispatch(createFilter({ order: 6, type: 'filter', name: 'Public Repos',     query: { access: 'public' } }))
    dispatch(createFilter({ order: 7, type: 'filter', name: 'Assigned to me',   query: { 'assignee.login': login } }))
    dispatch(createFilter({ order: 8, type: 'filter', name: 'Created by me',    query: { 'user.login': login } }))
    dispatch(createFilter({ order: 9, type: 'filter', name: 'Participating',    query: { $nor: [ {'user.login': login}, {'assignee.login': login} ] } }))

    // dispatch(getNotifications())

    return all({
      orgRepos: ghApi.getAccessibleRepos(['organization_member']),
      ownRepos: ghApi.getAccessibleRepos(['owner'])
    })
      .then(({orgRepos, ownRepos}) => {
        orgRepos.forEach(repo => dispatch(createFilter({
          type: 'organization-repo',
          name: repo.full_name,
          query: {
            owner: repo.owner.login,
            repo: repo.name
          }
        })))
        ownRepos.forEach(repo => dispatch(createFilter({
          type: 'my-repo',
          name: repo.name,
          query: {
            owner: login,
            repo: repo.name
          }
        })))
      })
      .then(() => dispatch(getIssues()))
      .then(() => dispatch(updateFilters()))
  }
)

export const updateFilters = () => (
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

export const getIssues = () => (
  (dispatch, getState) => {
    let {user: { login }} = getState()
    return all({
      privateIssues: ghApi.issueSearch(`involves:${login} is:private`),
      publicIssues: ghApi.issueSearch(`involves:${login} is:public`)
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
  }
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
