import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 查询折扣包详情
 * @param {*} id
 */
export function findDiscount(id) {
  const data = {
    id
  }
  const newData = querystring.stringify(data)
  return request({
    url: '/shop/findDiscount',
    method: 'post',
    data: newData
  })
}
