import qry from 'qry'
import objectfilter from 'object-filter'

export default function filterIssues(issues, query) {
  return objectfilter(issues, qry(query))
}
