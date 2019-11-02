import request from '../utils/request'
var querystring = require('querystring')

/**
 *  职级角色查询
 */
export function selectRole() {
  return request({
    url: 'shop/selectRole',
    method: 'get',
  })
}

/**
 * 后台用户详情查询
 * @param {*} id
 */
export function shopSelectDetails(id) {
  const newData = querystring.stringify({id})
  return request({
    url: 'shop/shopSelectDetails',
    method: 'post',
    data: newData
  })
}

/**
 * 获取验证码
 */
export function getImgCode() {
  return request({
    url: 'basics/getImgCode',
    method: 'get'
  })
}

/**
 * 验证图形验证码是否正确
 * @param {*} code
 */
export function checkRandCode(code) {
  return request({
    url: 'basics/checkRandCode?code=' + code,
    method: 'get'
  })
}

/**
 * 发送验证码
 * @param {*} code
 */
export function sendSms(code) {
  const data = {
    mobile: code
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'basics/sendSms',
    data: newData,
    method: 'post'
  })
}

/**
 * 修改密码
 * @param {*} adminId
 * @param {*} password
 * @param {*} msgCode
 */
export function forgetPwd(adminId, password, msgCode) {
  const data = {
    msgCode,
    password,
    adminId,
    confirmPwd: password
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'basics/editPwd',
    data: newData,
    method: 'post'
  })
}

/**
 * 查询轮播图
 */
export function seeDetailAdv() {
  return request({
    url: 'shop/seeDetailAdv',
    method: 'get'
  })
}
