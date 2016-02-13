import React from 'react'
import { connect } from 'react-redux'
import Flex from 'react-flex-component'
import { hashHistory } from 'react-router'

@connect(({defaultFilterId}) => ({defaultFilterId}))
export default class Inbox extends React.Component {
  componentDidMount() {
    if (this.props.params.filterId === undefined) {
      hashHistory.replace(`/inbox/filters/${this.props.defaultFilterId}`)
    }
  }

  render() {
    return (
      <Flex grow={1}>
        {this.props.filters}
        {this.props.issues}
      </Flex>
    )
  }
}
