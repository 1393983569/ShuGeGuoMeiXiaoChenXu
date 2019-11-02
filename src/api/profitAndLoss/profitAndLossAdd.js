import request from '../.././utils/request'
var querystring = require('querystring')

/**
 * 新建成本数据
 * @param {*} data
 */
export function selectProfitLoss(data) {
  const _data = {}
  for (let key in data) {
    if (data[key]) _data[key] = data[key]
  }
  const newData = querystring.stringify(_data)
  return request({
    url: 'shop/addProfitLoss',
    method: 'post',
    data: newData
  })
}
