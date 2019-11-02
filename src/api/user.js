import request from '.././utils/request'
var querystring = require('querystring')

export function userLogin(data) {
  console.log(data, 'data...............................')
  let newData = querystring.stringify(data)
  return request({
    url: '/basics/login',
    method: 'post',
    data: newData
  })
}
