import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 删除店铺职员
 * @param {*} id
 */
export function deleteShopStaff(id) {
  return request({
    url: 'shop/deleteShopStaff?id=' + id,
    method: 'get'
  })
}

/**
 * 编辑
 * @param {*} data
 */
export function editShopStaff(data) {
  data.type = 2
  return request({
    url: 'shop/editShopStaff',
    data: querystring.stringify(data),
    method: 'post'
  })
}

/**
 * 新建
 * @param {*} data
 */
export function addShopStaff(data) {
  data.type = 2
  return request({
    url: 'shop/addShopStaff',
    data: querystring.stringify(data),
    method: 'post'
  })
}
