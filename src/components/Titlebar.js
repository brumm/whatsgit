import React from 'react'
import Flex from 'react-flex-component'

import style from '../styles/Titlebar.scss'

export default class Titlebar extends React.Component {
  render() {
    return (
      <Flex alignItems='center' justifyContent='flex-end' shrink={0} className={style.Titlebar} />
    )
  }
}
