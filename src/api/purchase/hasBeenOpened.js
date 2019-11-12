import request from '../.././utils/request'
var querystring = require('querystring')

export function queryNoPageOrder(status, shopId, time, param) {
  const timeText = RegExp(/-/g)
  const timeList = timeText.test(time) ? time.split('-') : [time]
  const data = {
    status,
    shopId
  }
  if (timeList[0]) data.year = timeList[0]
  if (timeList[1]) data.month = timeList[1]
  if (timeList[2]) data.day = timeList[2]
  if (param) data.param = param
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/queryNoPageOrder',
    data: newData,
    method: 'POST'
  })
}
