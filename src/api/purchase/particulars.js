import request from '../.././utils/request'
var querystring = require('querystring')

/**
 * 查询商品详情
 * @param {*} id
 */
export function selectGoodsDetails(id) {
  let data = {
    id
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/selectGoodsDetails',
    method: 'post',
    data: newData
  })
}

/**
 * 查询商品详情
 * @param {*} goodsId
 */
export function shopFindById(goodsId, adminId) {
  let data = {
    goodsId,
    adminId
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/findById',
    method: 'post',
    data: newData
  })
}
