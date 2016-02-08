import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Flex from 'react-flex-component'
import removeMarkdown from 'remove-markdown'
import Octicon from 'react-octicon'

import objectToArray from '../utils/objectToArray'
import style from '../styles/Issues.scss'

@connect(({issues, filterOutputCache}, {params: {filterId}}) => {
  issues = filterOutputCache[filterId].map(issueId => ({
    id: issueId,
    ...issues[issueId]
  }))
  return {
    issues
  }
})
export default class Issues extends React.Component {
  render() {
    return (
      <Flex grow={1}>

        <Flex grow={0.8} basis={0} direction='column' className={style.IssueList}>
          {this.props.issues.map(issue => (
            <Link
              to={`/inbox/filters/${this.props.params.filterId}/issues/${issue.id}`}
              className={[style.IssueListItem, issue.state].join(' ')}
              activeClassName={style.IssueListItemSelected}
              key={issue.id}
            >
              <div className={style.repo}>
                <Octicon name={
                    issue.pull_request !== undefined
                    ? 'git-pull-request'
                    : issue.state === 'closed'
                    ? 'issue-closed'
                    : 'issue-opened'
                  } />

                {`${issue.owner}/${issue.repo}`}
              </div>

              <div className={style.title}>
                {issue.title}
              </div>

              {issue.body &&
                <div className={style.body}>
                  {removeMarkdown(issue.body.slice(0, 300))}
                </div>
              }
            </Link>
          ))}
        </Flex>

        {this.props.children}
      </Flex>
    )
  }
}

export class EmptyIssues extends React.Component {
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
