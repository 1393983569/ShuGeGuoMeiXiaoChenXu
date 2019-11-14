import request from '../.././utils/request'
var querystring = require('querystring')

export function selectList() {
  return request({
    url: '/basics/selectList',
    method: 'get'
  })
}

/**
 * 分页查询掌柜端查询二级品类下的商品列表
 * @param {*} categoryOneId
 * @param {*} categoryTwoId
 */
export function getAllShopByGoods(categoryOneId, categoryTwoId, adminId, pageNum) {
  let data = {
    categoryOneId,
    categoryTwoId,
    adminId,
    pageNum,
    pageSize: 7
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/selectGoods',
    method: 'post',
    data: newData
  })
}

/**
 * 分页查询掌柜端查询二级品类下的商品列表
 * @param {*} categoryOneId
 * @param {*} categoryTwoId
 */
export function shopSelectGoods(categoryOneId, categoryTwoId, adminId, pageNum) {
  let data = {
    categoryOneId,
    categoryTwoId,
    adminId,
    pageNum,
    pageSize: 7
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/getAllShopByGoods',
    method: 'post',
    data: newData
  })
}

/**
 * 添加商品
 * @param {*} data
 */
export function addCart(data) {
  return request({
    url: '/shop/addCart',
    method: 'post',
    data: [data]
  })
}

/**
 * 查询购物车
 */
export function selectPageCart(orderNo) {
  let data = {
    orderNo
  }
  let newData = querystring.stringify(data)
  return request({
    url: '/shop/findByOrderNo',
    data: newData,
    method: 'post'
  })
}

/**
 * 删除购物车
 * @param {*} data
 */
export function deleteCart(id) {
  return request({
    url: '/shop/deleteCart?id=' + id,
    method: 'GET'
  })
}

/**
 * 掌柜端生成订单
 * @param {*} orderDetailDomains
 * @param {*} shopId
 * @param {*} totalMoney
 */
export function addShopOrder(list, totalMoney, shopId) {
  return request({
    url: `/shop/addShopOrder?shopId=${parseInt(shopId)}&totalMoney=${parseInt(totalMoney)}`,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    data: JSON.stringify(list)
  })
}

/**
 * 新建盘点记录
 * @param {*} data
 */
export function addRecord(data) {
  return request({
    url: `/shop/addRecord`,
    method: 'post',
    data
  })
}

/**
 * 修改订单商品数量
 * @param {*} data
 */
export function updateAmount(data) {
  let newData = querystring.stringify({data})
  return request({
    url: '/shop/updateAmount',
    data: data,
    method: 'post'
  })
}
