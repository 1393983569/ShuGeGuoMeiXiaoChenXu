import Taro, { Component } from '@tarojs/taro'

import {
  ADD,
  MINUS,
  CHANGE_APP_ON_LAUNCH,
  INSERT_AUTHORIZE,
  INSERT_USER_DATA,
  INSERT_MENU_LIST,
  ORDER_STATE,
  NAVIGATION_INDEX
} from '../constants/counter'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}

//更改登录状态
export const changeAppOnLaunch = () => {
  return {
    type: CHANGE_APP_ON_LAUNCH
  }
}

//写入请求token
export const insertToken = (token) => {
  return {
    type: INSERT_AUTHORIZE,
    token
  }
}

// 写入用户信息
export const insertUserData = (dataUser) => {
  Taro.setStorageSync('adminId', {
    id: dataUser.id,
    shopId: dataUser.shopId
  })
  return {
    type: INSERT_USER_DATA,
    dataUser
  }
}

// 货架 购物车 订单
export const insertMenuList = (arr) => {
  return {
    type: INSERT_MENU_LIST,
    menuList: arr
  }
}

// 订单状态
export const setOrderState = (orderState) => {
  return {
    type: ORDER_STATE,
    orderState: orderState
  }
}

// 写入当前导航的下标
export const navigationIndex = (index) => {
  return {
    type: NAVIGATION_INDEX,
    navigationIndex: index
  }
}
