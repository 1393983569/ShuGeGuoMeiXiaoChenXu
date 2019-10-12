import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 会员消费记录详情
 * @param {*} orderId
 */
export function selectOrderDetail(orderId) {
  const data = {
    orderId
  }
  const newData = querystring.stringify(data)
  return request({
    url: '/shop/selectOrderDetail',
    method: 'post',
    data: newData
  })
}
