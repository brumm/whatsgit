import React from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import Flex from 'react-flex-component'
import Octicon from 'react-octicon'

import { setLoggedIn, setDefaultFilterId, getUser } from '../redux/actions'
import startGithubAuth from '../utils/startGithubAuth'
import makeId from '../utils/makeId'
import style from '../styles/Login.scss'

@connect()
export default class Login extends React.Component {

  state = {
    loading: false
  }

  auth() {
    let defaultFilterId = makeId()
    let auth = startGithubAuth()
    auth.then(token => {
        localStorage.setItem('token', token)
        this.props.dispatch(setDefaultFilterId(defaultFilterId))
        this.props.dispatch(setLoggedIn(true))
        this.setState({ loading: true })
        this.props.dispatch(getUser()).then(() => {
          this.setState({ loading: false })
          hashHistory.replace(`/inbox/filters/${defaultFilterId}`)
        })
      })
    auth.catch(::console.error)
  }

  render() {
    return (
      <Flex
        alignItems='center'
        justifyContent='center'
        grow={1}
        className={style.LoginPage}
        direction='column'
      >
        <Octicon name='mark-github' mega />

        <button className={style.LoginButton} onClick={::this.auth}>
          {this.state.loading
            ? <span>Loading issues...</span>
            : <span>Login with Github</span>
          }
        </button>
      </Flex>
    )
  }
}
