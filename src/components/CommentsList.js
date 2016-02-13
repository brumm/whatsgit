import React from 'react'
import Flex from 'react-flex-component'
import MarkdownIt from 'markdown-it'
import emojiIt from 'markdown-it-emoji'
import TimeAgo from 'react-timeago'
import Octicon from 'react-octicon'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'

import { postComment } from '../redux/actions'

const md = new MarkdownIt({
  linkify: true,
  typographer: true
})
md.use(emojiIt)

import style from '../styles/CommentsList.scss'

class Comment extends React.Component {
  render() {
    return (
      <Flex className={style.Comment} shrink={0} direction='column'>

        <Flex className={style.header} shrink={0} alignItems='center' grow={1}>
          <div className={style.avatar}>
            <img width="48px" height="48px" src={this.props.user.avatar_url + '&s=48'} />
          </div>

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
            <div className={style.avatar}>
              <img width="48px" height="48px" src={this.props.user.avatar_url + '&s=48'} />
            </div>
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

@connect(({user}) => ({user}))
export default class CommentsList extends React.Component {
  render() {
    return (
      <Flex direction='column' className={style.CommentsList} shrink={0}>
        {this.props.comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))}

        <NewComment issueId={this.props.issueId} user={this.props.user} />

      </Flex>
    )
  }
}
