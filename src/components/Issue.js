import React from 'react'
import { connect } from 'react-redux'
import Flex from 'flex-component'
import MarkdownIt from 'markdown-it'
import emojiIt from 'markdown-it-emoji'
import highlightIt from 'markdown-it-highlightjs'
import taskLists from 'markdown-it-task-lists'

import style from '../styles/Issue.scss'
import CommentsList from './CommentsList'
import Avatar from './Avatar'

import { closeIssue, openIssue } from '../redux/actions'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})
md.use(emojiIt)
md.use(highlightIt, { auto: true, code: false })
md.use(taskLists)

function isLight(c) {
  let sum = parseInt(c[0]+c[1], 16)
  sum += parseInt(c[2]+c[3], 16)
  sum += parseInt(c[4]+c[5], 16)
  return sum > 400
}

@connect(({user, issues, comments, events}, {params: {issueId}}) => {
  comments = comments[issueId] || []
  events = events[issueId] || []

  comments = comments
    .concat(events)
    .sort((a, b) => Date.parse(a.created_at) < Date.parse(b.created_at) ? -1 : 1)

  return {
    user,
    issue: issues[issueId],
    comments,
  }
})
export default class Issue extends React.Component {
  render() {
    let isIssue = this.props.issue.pull_request === undefined
    let isIssueCreator = this.props.issue.user.login === this.props.user.login
    return (
      <Flex
        grow={1.2}
        basis={0}
        className={style.Issue}
        direction='column'
      >

        <Flex className={style.header} shrink={0} alignItems='center'>

          <Avatar src={this.props.issue.user.avatar_url + '&s=48'} size={48} rounded={2} />
          {this.props.issue.assignee &&
            <Avatar src={this.props.issue.assignee.avatar_url + '&s=48'} size={48} rounded={2} />
          }

          <Flex direction='column' justifyContent='center' grow={1}>
            <div className={style.url}>
              <a href={this.props.issue.html_url}>
                <span>{`${this.props.issue.owner}/${this.props.issue.repo}/`}</span>
                <span className={style.number}>{`${this.props.issue.number}`}</span>
              </a>
            </div>

            <div className={style.title}>
              {this.props.issue.title}
            </div>

            {this.props.issue.labels.length > 0 &&
              <Flex className={style.labels}>
                {this.props.issue.labels.map(label => (
                  <Flex
                    key={label.name}
                    tagName='a'
                    href={`https://github.com/${this.props.issue.owner}/${this.props.issue.repo}/labels/${label.name}`}
                    alignItems='center'
                    className={style.label}
                    style={{
                      backgroundColor: `#${label.color}`, color: isLight(label.color) ? '#333' : 'white'
                    }}>
                      {label.name}
                    </Flex>
                ))}
              </Flex>
            }
          </Flex>

          {isIssueCreator &&
            <Flex direction='column' justifyContent='flex-end' shrink={0}>
              {isIssue
                ? (
                  <Flex direction='column' justifyContent='flex-end' shrink={0}>
                    {this.props.issue.state === 'open' &&
                      <button onClick={() => this.props.dispatch(closeIssue(this.props.issue.id))} className={style.actionButton}>Close issue</button>
                    }
                    {this.props.issue.state === 'closed' &&
                      <button onClick={() => this.props.dispatch(openIssue(this.props.issue.id))} className={style.actionButton}>Reopen issue</button>
                    }
                  </Flex>
                )
                : (
                  <Flex direction='column' justifyContent='flex-end' shrink={0}>
                    {this.props.issue.state === 'open' &&
                      <button className={style.actionButton}>Merge pull request</button>
                    }
                  </Flex>
                )
              }
            </Flex>
          }
        </Flex>


        <div style={{overflowY: 'auto'}}>
          <Flex direction='column' shrink={0}>
            {this.props.issue.body &&
              <div className={[style.body, 'markdown-body'].join(' ')} dangerouslySetInnerHTML={{__html: md.render(this.props.issue.body)}} />
            }
          </Flex>

          <CommentsList issueId={this.props.issue.id} comments={this.props.comments} />
        </div>

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
