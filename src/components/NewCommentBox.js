import React from 'react'
import Flex from 'flex-component'
import MarkdownIt from 'markdown-it'
import highlightIt from 'markdown-it-highlightjs'
import emojiIt from 'markdown-it-emoji'
import { connect } from 'react-redux'
import Octicon from 'react-octicon'
import Textarea from 'react-textarea-autosize'

import Avatar from './Avatar'

const md = new MarkdownIt({
  linkify: true,
  typographer: true
})
md.use(highlightIt, { auto: true, code: false })
md.use(emojiIt)

import style from '../styles/NewCommentBox.scss'

@connect()
export default class NewCommentBox extends React.Component {
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
      <Flex className={style.NewCommentBox} shrink={0} direction='column'>

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
