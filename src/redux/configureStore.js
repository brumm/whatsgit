import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import persistState from 'redux-localstorage'

import reducers from './reducers'
const loggerMiddleware = createLogger({ collapsed: true })
const rootReducer = combineReducers(reducers)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
      ),
      persistState([
        'filters',
        'user',
        'issues',
        'comments',
        'events',
        'defaultFilterId',
        'notifications'
      ])
    )
  )

  return store
}
