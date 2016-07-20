import React from 'react'
import Flex from 'flex-component'
import MarkdownIt from 'markdown-it'
import { connect } from 'react-redux'

import {Comment , CompactComment} from './Comment'
import NewCommentBox from './NewCommentBox'
import Event from './Event'
import { postComment } from '../redux/actions'

import style from '../styles/CommentsList.scss'

@connect(({user}) => ({user}))
export default class CommentsList extends React.Component {

  getComponent(comment, index, collection) {
    if (comment.body) {
      if (collection[index - 1] && collection[index - 1].body && collection[index - 1].user.login === comment.user.login) {
        return <CompactComment key={comment.id} body={comment.body} />
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

        <NewCommentBox issueId={this.props.issueId} user={this.props.user} />

      </Flex>
    )
  }
}
