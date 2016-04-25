import React from 'react'
import Flex from 'react-flex-component'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'

import { refreshIssues } from '../redux/actions'
import style from '../styles/Titlebar.scss'

@connect(({ loggedIn }) => ({ loggedIn }))
export default class Titlebar extends React.Component {
  render() {
    return (
      <Flex alignItems='center' justifyContent='flex-end' shrink={0} className={style.Titlebar}>
        {this.props.loggedIn &&
          <Octicon name="sync" onClick={() => this.props.dispatch(refreshIssues())} />
        }
      </Flex>
    )
  }
}
