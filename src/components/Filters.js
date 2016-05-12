import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Flex from 'flex-component'

import style from '../styles/Filters.scss'
import objectToArray from '../utils/objectToArray'

class FiltersListItem extends React.Component {

  render() {
    return (
      <Link
        to={`/inbox/filters/${this.props.id}`}
        className={style.FilterListItem}
        activeClassName={style.FilterListItemSelected}
        key={this.props.id}
      >
        <div className={style.name}>{this.props.name}</div>
        <Flex alignItems='center' justifyContent='center' className={style.count}>{this.props.count}</Flex>
      </Link>
    )
  }
}

@connect(({filters}) => ({
  filters: objectToArray(filters)
}))
export default class Filters extends React.Component {
  render() {
    return (
      <Flex className={style.FilterList} direction='column'>
        <Flex alignItems='flex-end' className={style.label}>Filters</Flex>

        {this.props.filters.map(filter => (
          <FiltersListItem key={filter.id} {...filter} />
        ))}
      </Flex>
    )
  }
}
