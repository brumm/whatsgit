import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Flex from 'react-flex-component'

import style from '../styles/Filters.scss'
import objectToArray from '../utils/objectToArray'

@connect(({filters, filterOutputCache}) => ({
  filters: objectToArray(filters, ({id}) => ({
    count: (filterOutputCache[id] || []).length
  }))
}))
export default class Filters extends React.Component {
  render() {
    return (
      <Flex className={style.FilterList} direction='column'>
        {this.props.filters.map(filter => (
          <Link
            to={`/inbox/filters/${filter.id}`}
            className={style.FilterListItem}
            activeClassName={style.FilterListItemSelected}
            key={filter.id}
          >
            <div className={style.name}>{filter.name}</div>
            <Flex alignItems='center' justifyContent='center' className={style.count}>{filter.count}</Flex>
          </Link>
        ))}
      </Flex>
    )
  }
}
