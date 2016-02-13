import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Flex from 'react-flex-component'
import removeMarkdown from 'remove-markdown'
import Octicon from 'react-octicon'
import { hashHistory } from 'react-router'


import objectToArray from '../utils/objectToArray'
import style from '../styles/IssuesList.scss'

class IssuesListItem extends React.Component {
  render() {
    let previewText = this.props.latestComment ? this.props.latestComment : this.props
    return (
      <Link
        to={`/inbox/filters/${this.props.filterId}/issues/${this.props.id}`}
        className={[style.IssueListItem, this.props.state].join(' ')}
        activeClassName={style.IssueListItemSelected}
        key={this.props.id}
      >
        <Flex className={style.repo}>
          {this.props.unread && <div className={style.unreadMarker} />}

          {`${this.props.owner}/${this.props.repo}`}

          {this.props.comments > 0 &&
            <div className={style.commentCount}>{this.props.comments}</div>
          }
        </Flex>

        <div className={style.title}>
          <Octicon name={
            this.props.pull_request !== undefined
            ? 'git-pull-request'
              : this.props.tate === 'closed'
                ? 'issue-closed'
                : 'issue-opened'
          } />

        {this.props.title}
        </div>

        {previewText.body &&
          <div className={style.body}>
            {removeMarkdown(previewText.body.slice(0, 300))}
          </div>
        }
      </Link>
    )
  }
}

@connect(({issues, comments, filterOutputCache, notifications}, {params: {filterId}}) => {
  issues = (filterOutputCache[filterId] || []).map(issueId => {
    let issue = issues[issueId]
    return {
      id: issueId,
      unread: false,
      ...issue
    }
  })

  return {
    issues,
    comments
  }
})
export default class IssuesList extends React.Component {
  componentDidMount() {
    if (this.props.params.issueId === undefined) {
      hashHistory.replace(`/inbox/filters/${this.props.params.filterId}/issues/${this.props.issues[0].id}`)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.params.issueId === undefined) {
      hashHistory.replace(`/inbox/filters/${this.props.params.filterId}/issues/${this.props.issues[0].id}`)
    }
  }

  render() {
    return (
      <Flex grow={1}>

        <Flex grow={0.8} basis={0} direction='column' className={style.IssueList}>
          {this.props.issues.map(issue => {
            let latestComment = (this.props.comments[issue.id] || [])
            latestComment = latestComment[latestComment.length - 1]
            return <IssuesListItem key={issue.id} {...issue} filterId={this.props.params.filterId} latestComment={latestComment} />
          })}
        </Flex>

        {this.props.children}
      </Flex>
    )
  }
}

export class EmptyIssuesList extends React.Component {
  render() {
    return (
      <Flex
        grow={1}
        alignItems='center'
        justifyContent='center'
      >
        No Issues
      </Flex>
    )
  }
}
