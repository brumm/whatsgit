import './css/global.scss'

import React from 'react'
import { render } from 'react-dom'
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router'
import { Provider } from 'react-redux'

import configureStore from './redux/configureStore'
import { getComments } from './redux/actions'

import App from './components/App'
import Login from './components/Login'
import Inbox from './components/Inbox'
import IssuesList from './components/IssuesList'
import {EmptyIssuesList} from './components/IssuesList'
import Filters from './components/Filters'
import Issue from './components/Issue'
import {EmptyIssue} from './components/Issue'

const store = window.store = configureStore({
  loggedIn: !!window.localStorage.getItem('token')
})

hashHistory.listen(({pathname}) => console.info('[location]', pathname))

function requireLogin(nextState, replaceState) {
  if (store.getState().loggedIn === false) {
    replaceState('/login')
  }
}

function loadCommentsIfNeeded(nextState, replaceState, done) {
  const {filterId, issueId} = nextState.params

  if (!store.getState().issues[issueId]) {
    replaceState(`/inbox/filters/${filterId}`)
  } else {
    if (store.getState().comments[issueId] === undefined) {
      store.dispatch(getComments(issueId))
      done()
    } else {
      done()
    }
  }
}

render((
  <Provider store={store}>
    <Router history={hashHistory}>

      <Route component={App}>
        <Route path='/login' component={Login} />
        <Route path='/inbox' component={Inbox} onEnter={requireLogin}>
          <IndexRoute components={{issues: EmptyIssuesList, filters: Filters}} />
          <Route path="filters/:filterId" components={{issues: IssuesList, filters: Filters}}>
            <IndexRoute component={EmptyIssue} />
            <Route path="issues/:issueId" component={Issue} onEnter={loadCommentsIfNeeded} />
          </Route>
        </Route>
      </Route>

      <Redirect from='*' to='/inbox' />

    </Router>
  </Provider>
), document.querySelector('#app'))
