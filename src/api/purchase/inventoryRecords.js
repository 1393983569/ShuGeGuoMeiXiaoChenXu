import request from '../.././utils/request'
var querystring = require('querystring')

/**
 * 分页查询盘点记录
 * @param {*} year
 * @param {*} month
 * @param {*} day
 * @param {*} pageNum
 */
export function shopPageRecord(year, month, day, pageNum) {
  const data = {
    year,
    month,
    day,
    pageNum,
    pageSize: 7
  }
  const submitData = {}
  for (let key in data) {
    if (data[key]) {
      submitData[key] = data[key]
    }
  }
  let newData = querystring.stringify(submitData)
  return request({
    url: '/shop/PageRecord',
    data: newData,
    method: 'POST'
  })
}


