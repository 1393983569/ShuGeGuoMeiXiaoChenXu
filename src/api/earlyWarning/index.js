import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 查询预警设置
 */
export function selectEarly(shopId) {
  const data = {
    shopId
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'shop/selectEarly',
    method: 'post',
    data: newData
  })
}

/**
 * 添加预警设置
 * @param {*} data
 */
export function addEarly(data) {
  // console.log(data)
  const newData = querystring.stringify(data)
  console.log(newData, data)
  return request({
    url: 'shop/addEarly',
    method: 'post',
    data: newData
  })
}
