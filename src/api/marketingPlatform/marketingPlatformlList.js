import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 分页查询折扣包列表
 * @param {*} pageNum
 * @param {*} shopId
 * @param {*} status
 */
export function queryDiscount(pageNum, shopId, status) {
  const data = {
    pageNum,
    shopId,
    status,
    pageSize: 9999
  }
  const newData = querystring.stringify(data)
  return request({
    url: '/shop/queryDiscount',
    method: 'post',
    data: newData
  })
}

/**
 * 折扣包启用停用
 * @param {*} id
 * @param {*} status
 */
export function editStatus(id, status) {
  const data = {
    id,
    status
  }
  const newData = querystring.stringify(data)
  return request({
    url: '/shop/editStatus',
    method: 'post',
    data: newData
  })
}
