import request from '../../utils/request'
var querystring = require('querystring')

export function selectPage(memberId, pageNum) {
  const data = {
    memberId,
    pageNum,
    pageSize: 7
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'shop/selectPage',
    method: 'post',
    data: newData
  })
}
