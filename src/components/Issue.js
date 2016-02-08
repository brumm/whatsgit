import React from 'react'
import { connect } from 'react-redux'
import Flex from 'react-flex-component'
import MarkdownIt from 'markdown-it'
import emojiIt from 'markdown-it-emoji'

import style from '../styles/Issue.scss'
import Comments from './Comments'

const md = new MarkdownIt({
  linkify: true,
  typographer: true
})
md.use(emojiIt)

@connect(({user, issues, comments}, {params: {issueId}}) => ({
  user,
  issue: issues[issueId],
  comments: comments[issueId] || []
}))
export default class Issue extends React.Component {
  render() {
    return (
      <Flex
        grow={1.2}
        basis={0}
        className={style.Issue}
        direction='column'
      >

        <Flex direction='column' shrink={0}>
          <Flex className={style.header} shrink={0}>
            <div className={style.avatar}>
              <img src={`${this.props.issue.user.avatar_url}&s=48`} />
            </div>
            <Flex direction='column' justifyContent='center'>
              <div className={style.url}>
                {`${this.props.issue.owner}/${this.props.issue.repo}#${this.props.issue.number}`}
              </div>
              <div className={style.title}>{this.props.issue.title}</div>
            </Flex>
          </Flex>

          {this.props.issue.body &&
            <div className={[style.body, 'markdown-body'].join(' ')} dangerouslySetInnerHTML={{__html: md.render(this.props.issue.body)}} />
          }
        </Flex>

        <Comments comments={this.props.comments} />

      </Flex>
    )
  }
}

export class EmptyIssue extends React.Component {
  render() {
    return (
      <Flex
        grow={1.2}
        basis={0}
        className={style.Issue}
        direction='column'
        alignItems='center'
        justifyContent='center'
      >
      </Flex>
    )
  }
}
