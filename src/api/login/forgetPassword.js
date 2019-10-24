import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 发送验证码
 */
export function sendSms(mobile) {
  const data = {
    mobile
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'basics/sendSms',
    method: 'post',
    data: newData
  })
}

export function editPwd(data) {
  const newData = querystring.stringify(data)
  return request({
    url: 'basics/editPwd',
    method: 'post',
    data: newData
  })
}
