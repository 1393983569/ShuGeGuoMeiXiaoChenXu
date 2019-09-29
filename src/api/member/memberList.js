import request from '../../utils/request'
var querystring = require('querystring')

/**
 * 掌柜端分页查询会员列表
 * @param {*} pageNum
 */
export function queryMember(pageNum) {
  return request({
    url: '/shop/queryMember?pageNum=' + pageNum + '&pageSize=7',
    method: 'get'
  })
}
