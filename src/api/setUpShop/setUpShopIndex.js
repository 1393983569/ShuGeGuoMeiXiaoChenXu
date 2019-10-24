import request from '../../utils/request'
var querystring = require('querystring')

export function queryShop(id) {
  return request({
    url: '/shop/queryShop?id=' + id,
    method: 'get'
  })
}
