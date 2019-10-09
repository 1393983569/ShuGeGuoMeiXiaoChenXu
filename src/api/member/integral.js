import request from '../../utils/request'
var querystring = require('querystring')

export function queryNoPageIntegral(memberId) {
  const data = {
    memberId
  }
  const newData = querystring.stringify(data)
  return request({
    url: '/shop/queryNoPageIntegral',
    data: newData,
    method: 'post'
  })
}
