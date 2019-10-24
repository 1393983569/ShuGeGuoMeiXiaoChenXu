import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 后台用户详情查询
 * @param {*} id
 */
export function shopSelectDetails(id) {
  const data = {
    id
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'shop/shopSelectDetails',
    method: 'post',
    data: newData
  })
}
