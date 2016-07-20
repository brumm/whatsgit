import React from 'react'
import Flex from 'flex-component'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'

import { refreshData } from '../redux/actions'
import style from '../styles/Titlebar.scss'

const Filterbutton = ({active, icon, label, spin, ...props}) => (
  <Flex {...props} tagName='button' alignItems='center' justifyContent='center' className={active ? style.activeButton : style.button}>
    <Octicon className={style.icon} name={icon} spin={spin} />
    {label}
  </Flex>
)

@connect(({ loggedIn }) => {
  return {
    loggedIn
  }
})

export default class Titlebar extends React.Component {
  state = {
    loading: false
  }

  refreshData() {
    this.setState({ loading: true })
    this.props.dispatch(refreshData())
      .then(() => {
        this.setState({ loading: false })
      })
  }

  signOut() {
    localStorage.clear()
    location.reload()
  }

  render() {
    return (
      <Flex alignItems='center' shrink={0} className={style.Titlebar}>

        {this.props.loggedIn &&
          <Flex className={style.buttonGroup} style={{ marginLeft: 'auto' }}>
            <Filterbutton icon='sync' onClick={() => this.refreshData() } spin={this.state.loading} />
            <Filterbutton icon='sign-out' onClick={() => this.signOut() } />
          </Flex>
        }
      </Flex>
    )
  }
}
