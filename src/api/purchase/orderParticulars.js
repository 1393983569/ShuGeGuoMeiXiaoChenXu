import request from '../.././utils/request'
var querystring = require('querystring')

export function findByOrderIdOne(orderNo) {
  const data = {
    orderNo
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/findByOrderIdOne',
    data: newData,
    method: 'POST'
  })
}
