import React from 'react'
import Flex from 'react-flex-component'

import Titlebar from './Titlebar'
import style from '../styles/App.scss'

export default class App extends React.Component {
  render() {
    return (
      <Flex direction='column' className={style.App}>
        <Titlebar />

        {this.props.children}
      </Flex>
    )
  }
}
