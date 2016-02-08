import React from 'react'
import Flex from 'react-flex-component'
import MarkdownIt from 'markdown-it'
import emojiIt from 'markdown-it-emoji'

const md = new MarkdownIt({
  linkify: true,
  typographer: true
})
md.use(emojiIt)

import style from '../styles/Comments.scss'

class Comment extends React.Component {
  render() {
    return (
      <Flex className={style.Comment} shrink={0} alignItems='center'>

        <div className={style.avatar}>
          <img width="48px" height="48px" src={this.props.user.avatar_url + '&s=48'} />
        </div>

        <div
          className={[style.body, 'markdown-body'].join(' ')}
          style={{ flexGrow: 1, flexShrink: 1 }}
          dangerouslySetInnerHTML={{__html: md.render(this.props.body)}}
          />

      </Flex>
    )
  }
}

export default class Comments extends React.Component {
  render() {
    return (
      <Flex direction='column' className={style.CommentList} shrink={0}>
        {this.props.comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))}
      </Flex>
    )
  }
}
