import React from 'react'
import Flex from 'flex-component'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'

import { refreshData } from '../redux/actions'
import style from '../styles/Titlebar.scss'

@connect(({ loggedIn }) => {
  return {
    loggedIn
  }
})
export default class Titlebar extends React.Component {
  render() {
    return (
      <Flex alignItems='center' shrink={0} className={style.Titlebar}>
        {this.props.loggedIn &&
          <Flex className={style.buttonGroup} style={{ marginLeft: 'auto' }}>
            <button className={style.button} onClick={() => this.props.dispatch(refreshData())}>
              <Octicon className={style.icon} name="sync" />
            </button>
            <button className={style.button} onClick={() => { localStorage.clear(); location.reload() }}>
              <Octicon className={style.icon} name="sign-out" />
            </button>
          </Flex>
        }
      </Flex>
    )
  }
}
