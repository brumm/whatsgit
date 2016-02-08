
export default function objectToArray(object = {}, callback = ()=>({})) {
  return Object.keys(object).map(id => {
    let item = {
      id,
      ...object[id]
    }
    return {
      ...item,
      ...callback(item)
    }
  })
}
