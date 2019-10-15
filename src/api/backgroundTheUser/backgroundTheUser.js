import request from '../../utils/request'
var querystring = require('querystring')

/**
 *  分页查询后台用户
 * @param {*} pageNum
 * @param {*} shopId
 */
export function selectPageAdmin(pageNum, shopId) {
  const data = {
    pageNum,
    shopId,
    pageSize: 7
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'shop/selectPageAdmin',
    method: 'post',
    data: newData
  })
}
