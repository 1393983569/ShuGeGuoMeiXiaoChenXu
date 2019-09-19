import request from '.././utils/request'
var querystring = require('querystring')

/**
 * 查询消息详情
 * @param {*} data
 */
export function shopFindMessage(id) {
  const data = {
    id
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/findMessage',
    method: 'post',
    data: newData
  })
}
