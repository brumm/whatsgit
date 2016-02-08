import { handleActions } from 'redux-actions'

export default {

  filters: handleActions({
    CREATE_FILTER: (state, {payload}) => ({
      ...state,
      ...payload
    })
  }, {}),

  filterOutputCache: handleActions({
    CREATE_FILTER_OUTPUT_CACHE: (state, {payload}) => ({
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

  issues: handleActions({
    SET_ISSUES: (state, {payload}) => payload
  }, {}),

  comments: handleActions({
    SET_COMMENTS: (state, {payload}) => ({
      ...state,
      ...payload
    })
  }, {}),

}
