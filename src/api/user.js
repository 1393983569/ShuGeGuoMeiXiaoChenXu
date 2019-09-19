import request from '.././utils/request'
var querystring = require('querystring')

export function login(data) {
  let newData = querystring.stringify(data)
  return request({
    url: '/basics/login',
    method: 'post',
    data: newData
  })
}
