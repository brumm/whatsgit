import React from 'react'
import Flex from 'flex-component'
import TimeAgo from 'react-timeago'
import Octicon from 'react-octicon'

import style from '../styles/Event.scss'

const events = {
  closed: event => `${event.actor.login} closed this`,
  reopened: event => `${event.actor.login} reopened this`,
  merged: event => `${event.actor.login} merged this pull request`,
  assigned: event => (
    event.assigner.login === event.assignee.login
    ? `${event.assigner.login} self-assigned this`
    : `${event.assigner.login} assigned ${event.assignee.login}`
  ),
  unassigned: event => (
    event.assigner.login === event.assignee.login
    ? `${event.assigner.login} removed their assignment`
    : `${event.assigner.login} unassigned ${event.assignee.login}`
  ),
  labeled: event => (
    <Flex alignItems='center'>
      <span>{`${event.actor.login} added the`}</span>
      <span className={style.label}>{event.label.name}</span>
      <span>label</span>
    </Flex>
  ),
  unlabeled: event => (
    <Flex alignItems='center'>
      <span>{`${event.actor.login} removed the`}</span>
      <span className={style.label}>{event.label.name}</span>
      <span>label</span>
    </Flex>
  ),
  milestoned: event => `${event.actor.login} added a milestone`,
  demilestoned: event => `${event.actor.login} removed a milestone`,
  renamed: event => (
    <div>
      <span>{`${event.actor.login}: renamed this to `}</span>
      <strong title={`was: ${event.rename.from}`}>
        {event.rename.to}
      </strong>
    </div>
  ),
  locked: event => `${event.actor.login} locked this`,
  unlocked: event => `${event.actor.login} unlocked this`,
  head_ref_deleted: event => `pull request's branch was deleted`,
  head_ref_restored: event => `pull request's branch was restored.`,
  // subscribed: event => event.event,
  // referenced: event => event.event,
  // mentioned: event => event.event,
}

export default class Event extends React.Component {
  render() {
    let eventFormatter = events[this.props.event]
    return eventFormatter ? (
      <Flex className={style.Event} alignItems='center' justifyContent='space-between'>
        <Flex>
          <Octicon name='primitive-dot' />
          {eventFormatter(this.props)}
        </Flex>
        <TimeAgo style={{ color: '#bcc7d1' }} date={this.props.created_at} />
      </Flex>
    ) : null
  }
}
