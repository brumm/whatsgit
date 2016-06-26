import './css/global.scss'

import React from 'react'
import { render } from 'react-dom'
import { Router, IndexRoute, Route, Redirect, hashHistory } from 'react-router'
import { Provider } from 'react-redux'

import configureStore from './redux/configureStore'
import { refreshData, getComments, getEvents } from './redux/actions'

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
  } else {
    store.dispatch(refreshData())

    if (process.env.DEV === undefined) {
      let { user: { email, login } } = store.getState()
      Raven.setUserContext({ email, login })
    }
  }
}

function loadCommentsIfNeeded(nextState, replaceState) {
  const {filterId, issueId} = nextState.params
  const issue = store.getState().issues[issueId]

  if (!issue) {
    replaceState(`/inbox/filters/${filterId}`)
  } else {
    store.dispatch(getComments(issueId))
    store.dispatch(getEvents(issueId))
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
