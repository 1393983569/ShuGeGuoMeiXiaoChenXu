import {
  ADD,
  INSERT_AUTHORIZE,
  INSERT_USER_DATA,
  INSERT_MENU_LIST,
  ORDER_STATE,
  NAVIGATION_INDEX
 } from '../constants/counter'

const INITIAL_STATE = {
  num: 0,
  token: '',
  id: '',
  shopId: '',
  menuList: [],
  orderState: '',
  navigationIndex: ''
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        num: state.num + 1
      }
      case INSERT_AUTHORIZE:
      return {
        ...state,
        token: action.token
      }
      case INSERT_USER_DATA:
      return {
        ...state,
        id: action.dataUser.id,
        shopId: action.dataUser.shopId,
      }
      case INSERT_MENU_LIST:
      return {
        ...state,
        menuList: action.menuList
      }
      case ORDER_STATE:
      return {
        ...state,
        orderState: action.orderState
      }
      case NAVIGATION_INDEX:
      return {
        ...state,
        navigationIndex: action.navigationIndex
      }
     default:
       return state
  }
}
