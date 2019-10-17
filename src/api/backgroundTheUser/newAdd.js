import request from '../../utils/request'
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
 * 掌柜端添加用户
 */
export function addAdmin(name, mobile, password, roleId, shopId) {
  const data = {
    roleId,
    name,
    mobile,
    password,
    shopId,
    type: 2,
    shopId
  }
  const newData = querystring.stringify(data)
  return request({
    url: 'shop/addAdmin',
    method: 'POST',
    data: newData
  })
}
