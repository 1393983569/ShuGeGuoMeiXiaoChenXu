import request from '../.././utils/request'
var querystring = require('querystring')

/**
 * 掌柜端查询子订单详情
 * @param {*} status
 */
export function findSubOrder(suborderNo) {
  const data = {
    suborderNo
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/findSubOrder',
    data: newData,
    method: 'POST'
  })
}

/**
 * 更新订单入库状态
 * @param {Array} dataList
 */
export function updateOrderStorage(dataList) {
  const data = {
    dataList
  }
  let newData = querystring.stringify(dataList)
  return request({
    url: '/shop/updateOrderStorage',
    data: newData,
    method: 'POST'
  })
}
