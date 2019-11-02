import request from '../.././utils/request'
var querystring = require('querystring')

/**
 * 成本数据查询
 * @param {*} year
 */
export function selectProfitLoss(year) {
  return request({
    url: 'shop/selectProfitLoss?year=' + year,
    method: 'get'
  })
}
