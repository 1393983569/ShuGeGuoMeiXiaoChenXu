import request from '../../utils/request'
var querystring = require('querystring')

/**
 *  分页查询后台用户
 * @param {*} id
 */
export function selectDetails(id) {
  console.log(id, '分页查询后台用户')
  const data = {
    id,
    type: 2
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'shop/shopSelectDetails',
    method: 'post',
    data: newData
  })
}

/**
 *  删除店铺职员
 * @param {*} id
 */
export function deleteShopStaff(id) {
  console.log(id)
  return request({
    url: 'shop/deleteShopStaff?id=' + id,
    method: 'get'
  })
}
