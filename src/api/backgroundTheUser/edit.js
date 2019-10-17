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
