import React from 'react'
import Flex from 'flex-component'
import MarkdownIt from 'markdown-it'
import emojiIt from 'markdown-it-emoji'
import TimeAgo from 'react-timeago'
import Octicon from 'react-octicon'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import highlightIt from 'markdown-it-highlightjs'

import Avatar from './Avatar'
import { postComment } from '../redux/actions'

const md = new MarkdownIt({
  linkify: true,
  typographer: true
})
md.use(highlightIt, { auto: true, code: false })
md.use(emojiIt)

import style from '../styles/CommentsList.scss'

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
      <span className={style.eventLabel}>{event.label.name}</span>
      <span>label</span>
    </Flex>
  ),
  unlabeled: event => (
    <Flex alignItems='center'>
      <span>{`${event.actor.login} removed the`}</span>
      <span className={style.eventLabel}>{event.label.name}</span>
      <span>label</span>
    </Flex>
  ),
  milestoned:        event => `${event.actor.login} added a milestone`,
  demilestoned:      event => `${event.actor.login} removed a milestone`,
  renamed:           event => (
    <div>
      <span>{`${event.actor.login} renamed this from`}</span>
      <strong>{event.rename.from}</strong>
      <span>to</span>
      <strong>{event.rename.to}</strong>
    </div>
  ),
  // renamed:           event => `${event.actor.login} renamed this from '${event.rename.from}' to '${event.rename.to}'`,
  locked:            event => `${event.actor.login} locked this`,
  unlocked:          event => `${event.actor.login} unlocked this`,
  head_ref_deleted:  event => `pull request's branch was deleted`,
  head_ref_restored: event => `pull request's branch was restored.`,
  // subscribed:        event => event.event,
  // referenced:        event => event.event,
  // mentioned:         event => event.event,
}

class Comment extends React.Component {
  render() {
    return (
      <Flex className={style.Comment} shrink={0} direction='column'>

        <Flex className={style.header} shrink={0} alignItems='center' grow={1}>
          <Avatar src={this.props.user.avatar_url + '&s=48'} rounded={2} size={28} />

          <div className={style.username}>
            {this.props.user.login} commented <TimeAgo date={this.props.updated_at} />
          </div>
        </Flex>

        <div
          className={[style.body, 'markdown-body'].join(' ')}
          style={{ flexGrow: 1, flexShrink: 1 }}
          dangerouslySetInnerHTML={{__html: md.render(this.props.body)}}
          />

      </Flex>
    )
  }
}

@connect()
class NewComment extends React.Component {
  state = {
    showPreview: false,
    comment: ''
  }

  onChange = ::this.onChange
  onChange({target: {value}}) {
    this.setState({ comment: value })
  }

  onKeyDown = ::this.onKeyDown
  onKeyDown({which, keyCode, metaKey}) {
    if (which === 13 && metaKey) {
      this.props.dispatch(postComment(this.props.issueId, this.state.comment))
      this.setState({ comment: '' })
    }
  }

  render() {
    return (
      <Flex className={style.NewComment} shrink={0} direction='column'>

        <Flex className={style.tools} alignItems='center' justifyContent='flex-end'>
          <Octicon
            name='markdown'
            onClick={() => this.setState({ showPreview: !this.state.showPreview })}
            style={{
              color: this.state.showPreview ? '#637A8E' : '#C9D1D8'
            }}
          />
        </Flex>

        <Flex>
          <Flex className={style.header} shrink={0} alignItems='center'>
            <Avatar src={this.props.user.avatar_url + '&s=48'} size={28} rounded={2} />
          </Flex>

          <Flex direction='column' grow={1}>
            {this.state.showPreview
              ? (
                <div
                  className={[style.body, 'markdown-body'].join(' ')}
                  style={{ flexGrow: 1, flexShrink: 1 }}
                  dangerouslySetInnerHTML={{__html: md.render(this.state.comment)}}
                  />
              )
              : (
                <Flex alignItems='center' grow={1}>
                  <Textarea onKeyDown={this.onKeyDown} placeholder='Leave a comment' value={this.state.comment} className={style.textarea} onChange={this.onChange} />
                </Flex>
              )
            }
          </Flex>
        </Flex>
      </Flex>
    )
  }
}

class Event extends React.Component {
  render() {
    let eventFormatter = events[this.props.event]
    return eventFormatter ? (
      <Flex className={style.event} alignItems='center' justifyContent='space-between'>
        <Flex>
          <Octicon name='primitive-dot' />
          {eventFormatter(this.props)}
        </Flex>
        <TimeAgo style={{ color: '#bcc7d1' }} date={this.props.created_at} />
      </Flex>
    ) : null
  }
}

@connect(({user}) => ({user}))
export default class CommentsList extends React.Component {
  getComponent(comment, index, collection) {
    if (comment.body) {
      if (collection[index - 1] && collection[index - 1].body && collection[index - 1].user.login === comment.user.login) {
        return <Flex className={style.compactComment} alignItems='center' key={comment.id}>
          <div
            className={[style.body, 'markdown-body'].join(' ')}
            style={{ flexGrow: 1, flexShrink: 1 }}
            dangerouslySetInnerHTML={{__html: md.render(comment.body)}}
            />
        </Flex>
      } else {
        return <Comment key={comment.id} {...comment} />
      }
    } else {
      return <Event key={comment.id} {...comment} />
    }
  }

  render() {
    return (
      <Flex direction='column' className={style.CommentsList} shrink={0}>
        {this.props.comments.map(this.getComponent)}

        <NewComment issueId={this.props.issueId} user={this.props.user} />

      </Flex>
    )
  }
}
