import request from '../.././utils/request'
var querystring = require('querystring')

/**
 * 分页查询掌柜端查询二级品类下的商品列表
 * @param {*} categoryTwoId 品类二级id
 * @param {*} pageNum 当前页
 * @param {*} pageSize 一页多少条
 * @param {*} id 记录id
 */
export function shopSelectDetails(
  adminId,
  categoryOneId,
  categoryTwoId,
  id,
  pageNum,
  recordingTime) {
  let data = {
    adminId,
    categoryOneId,
    categoryTwoId,
    id,
    pageNum,
    recordingTime,
    pageSize: 7
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/selectDetails',
    method: 'post',
    data: newData
  })
}

/**
 * 编辑盘点记录
 * @param {*} data
 */
export function editRecord(data) {
  return request({
    url: 'shop/editRecord',
    method: 'post',
    data
  })
}
