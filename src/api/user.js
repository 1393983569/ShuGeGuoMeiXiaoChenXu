import request from '.././utils/request'
var querystring = require('querystring')

export function userLogin(data) {
  const datas = {
    ...data,
    type: 2
  }
  let newData = querystring.stringify(datas)
  return request({
    url: '/basics/login',
    method: 'post',
    data: newData
  })
}
