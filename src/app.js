import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import 'taro-ui/dist/style/index.scss'

// 阿里矢量图标
import './fonts/iconfont.css'

import Index from './pages/login'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

  // 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// new Date().Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) {
  // author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

const store = configStore()

class App extends Component {

  config = {
    pages: [
      'pages/login/index', // 登录页
      'pages/home/index', // 首页
      'pages/information/index', // 消息中心
      'pages/InformationForDetails/index', // 资讯详情
      'pages/reportForms/manage/index', // 经营分析
      'pages/purchase/goodsShelf/goodsShelf', // 货架
      'pages/purchase/shoppingCart/shoppingCart', // 购物车
      'pages/purchase/orderForm/orderForm', // 订单
      'pages/purchase/orderForm/orderParticulars', // 大订单详情
      'pages/purchase/orderForm/childrenOrderParticulars', // 子订单详情
      'pages/purchase/libraryOfGoods/libraryOfGoodsList', // 商品库
      'pages/purchase/libraryOfGoods/particulars/particulars', // 商品详情
      'pages/purchase/libraryOfGoods/takeStock/takeStock', // 盘点 | 盘点编辑
      'pages/earlyWarning/index', // 预警设置
      'pages/purchase/libraryOfGoods/inventoryRecords/inventoryRecords', // 盘点记录
      'pages/backgroundTheUser/backgroundTheUser', // 后台用户
      'pages/backgroundTheUser/particulars/index', // 后台详情
      'pages/member/memberList', // 会员系统
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#8BC34A',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      onReachBottomDistance: 100
    }
  }

  componentDidMount () {

  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
