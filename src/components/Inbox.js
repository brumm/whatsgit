import React from 'react'
import { connect } from 'react-redux'
import Flex from 'react-flex-component'

@connect()
export default class Inbox extends React.Component {
  render() {
    return (
      <Flex grow={1}>
        {this.props.filters}
        {this.props.issues}
      </Flex>
    )
  }
}
