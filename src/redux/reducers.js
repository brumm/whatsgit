import { handleActions } from 'redux-actions'

export default {

  notifications: handleActions({
    SET_NOTIFICATIONS: (state, {payload}) => payload
  }, {}),

  filters: handleActions({
    SET_FILTERS: (state, {payload}) => payload,

    CREATE_FILTER: (state, {payload}) => ({
      ...state,
      ...payload
    })
  }, {}),

  user: handleActions({
    SET_USER: (state, {payload}) => payload
  }, null),

  loggedIn: handleActions({
    SET_LOGGED_IN: (state, {payload}) => payload
  }, false),

  defaultFilterId: handleActions({
    SET_DEFAULT_FILTER_ID: (state, {payload}) => payload
  }, null),

  issues: handleActions({
    SET_ISSUES: (state, {payload}) => payload,
    SET_ISSUE: (state, {payload}) => ({
      ...state,
      ...payload
    })
  }, {}),

  comments: handleActions({
    SET_COMMENTS: (state, {payload}) => ({
      ...state,
      ...payload
    })
  }, {}),

  events: handleActions({
    SET_EVENTS: (state, {payload}) => ({
      ...state,
      ...payload
    })
  }, {}),
}
