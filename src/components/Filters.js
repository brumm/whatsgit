import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Flex from 'flex-component'
import groupBy from 'lodash/groupBy'

import style from '../styles/Filters.scss'
import objectToArray from '../utils/objectToArray'

class Filterset extends React.Component {

  static defaultProps = {
    filterEmpty: true
  }

  state = {
    showItems: true
  }

  render() {

    let filters = this.props.filterEmpty ? this.props.filters.filter(({ matchedIssues }) => !!matchedIssues.length) : this.props.filters
    filters = this.props.sortMethod ? filters.sort(this.props.sortMethod) : filters

    return (
      <Flex shrink={0} direction='column'>
        <Flex alignItems='flex-end' className={style.label} onClick={() => this.setState({ showItems: !this.state.showItems })}>
          {this.props.label}
        </Flex>

        {this.state.showItems &&
          filters.map(filter => (
            <FiltersListItem key={filter.id} {...filter} />
          ))
        }
      </Flex>
    )
  }
}

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

const sortByMatchedIssueLength = (a, b) => a.matchedIssues.length > b.matchedIssues.length ? -1 : 1
const sortByOrder = (a, b) => a.order < b.order ? -1 : 1

@connect(({filters}) => ({
  ...groupBy(objectToArray(filters), 'type')
}))

export default class Filters extends React.Component {
  render() {

    let {
      'filter'           : filterType           = [],
      'my-repo'          : myRepoType           = [],
      'organization-repo': organizationRepoType = []
    } = this.props

    return (
      <Flex className={style.FilterList} direction='column'>

        <Filterset
          filters={myRepoType}
          sortMethod={sortByMatchedIssueLength}
          label='My Repos'
        />

        <Filterset
          filters={organizationRepoType}
          sortMethod={sortByMatchedIssueLength}
          label='Repos'
        />

        <Filterset
          filters={filterType}
          sortMethod={sortByOrder}
          label='Filters'
        />


      </Flex>
    )
  }
}
