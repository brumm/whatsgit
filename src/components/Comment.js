import React from 'react'
import Flex from 'flex-component'
import MarkdownIt from 'markdown-it'
import highlightIt from 'markdown-it-highlightjs'
import emojiIt from 'markdown-it-emoji'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'

const md = new MarkdownIt({
  linkify: true,
  typographer: true
})
md.use(highlightIt, { auto: true, code: false })
md.use(emojiIt)

import style from '../styles/Comment.scss'

export const Comment = ({user, body, updated_at}) => (
  <Flex className={style.Comment} shrink={0} direction='column'>

    <Flex className={style.header} shrink={0} alignItems='center' grow={1}>
      <Avatar src={user.avatar_url + '&s=48'} rounded={2} size={28} />

      <div className={style.username}>
        {user.login} commented <TimeAgo date={updated_at} />
      </div>
    </Flex>

    <div
      className={[style.body, 'markdown-body'].join(' ')}
      style={{ flexGrow: 1, flexShrink: 1 }}
      dangerouslySetInnerHTML={{__html: md.render(body)}}
      />

  </Flex>
)

export const CompactComment = ({body}) => (
  <Flex className={style.CompactComment} alignItems='center'>
    <div
      className={[style.body, 'markdown-body'].join(' ')}
      style={{ flexGrow: 1, flexShrink: 1 }}
      dangerouslySetInnerHTML={{__html: md.render(body)}}
      />
  </Flex>
)
