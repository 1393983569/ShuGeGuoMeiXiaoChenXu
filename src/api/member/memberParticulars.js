import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 会员消费记录详情
 * @param {*} pageNum
 */
export function selectOrderDetail(memberId, pageNum) {
  const data = {
    memberId,
    pageNum,
    pageSize: 7
  }
  const newData = querystring.stringify(data)
  return request({
    url: '/shop/queryNoPageConsume',
    data: newData,
    method: 'post'
  })
}

export function findMember(id) {
  return request({
    url: '/shop/findMember?id=' + id,
    method: 'get'
  })
}
