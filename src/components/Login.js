import React from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import Flex from 'react-flex-component'
import Octicon from 'react-octicon'

import { setLoggedIn, getUser } from '../redux/actions'
import startGithubAuth from '../utils/startGithubAuth'
import style from '../styles/Login.scss'

@connect()
export default class Login extends React.Component {

  auth() {
    startGithubAuth()
      .then(token => {
        localStorage.setItem('token', token)
        this.props.dispatch(setLoggedIn(true))
        this.props.dispatch(getUser())
        hashHistory.replace('/inbox/filters')
      })
      .catch(::console.error)
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
          <span>Login with Github</span>
        </button>
      </Flex>
    )
  }
}
