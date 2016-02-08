
export default function arrayToObject(array=[], callback=()=>({})) {
  return array.reduce((object, item) => {
    object[item.id] = {
      ...item,
      ...callback(item)
    }
    return object
  }, {})
}
