import request from '../utils/request'
var querystring = require('querystring')

export function selectPageRecord(category, pageNum, pageSize, shopId) {
  let dataList = {}
  const data = {
    category,
    pageNum,
    pageSize,
    shopId
  }
  for (let key in data) {
    if (data[key] !== null) {
      dataList[key] = data[key]
    }
  }
  let newData = querystring.stringify(dataList)
  return request({
    url: '/shop/queryMessage',
    data: newData,
    method: 'post'
  })
}
