import request from '../.././utils/request'
var querystring = require('querystring')

export function queryNoPageOrder(status) {
  const data = {
    status
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/queryNoPageOrder',
    data: newData,
    method: 'POST'
  })
}
