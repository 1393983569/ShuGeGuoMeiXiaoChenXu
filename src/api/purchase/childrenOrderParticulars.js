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
  return request({
    url: '/shop/updateInputQuantity',
    data: dataList,
    method: 'POST'
  })
}

/**
 * 店铺商品入库添加数据
 * @param {*} dataList
 */
export function shopAddInven(dataList, subOrderId) {
  return request({
    url: '/shop/addInven?subOrderId=' + subOrderId,
    data: dataList,
    method: 'POST'
  })
}
