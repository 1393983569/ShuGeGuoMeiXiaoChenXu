import request from '../../utils/request'
var querystring = require('querystring')

/**
 *  分页查询后台用户
 * @param {*} id
 */
export function selectDetails(id) {
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
