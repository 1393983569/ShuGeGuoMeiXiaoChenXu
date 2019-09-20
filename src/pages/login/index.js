import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { login } from '../../api/user'
import imgPng from '../../img/img_bg.png'
import { add, minus, insertToken, insertUserData, insertMenuList } from '../../actions/counter'

import './index.scss'

// 获取
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  setToken (e) {
    dispatch(insertToken(e))
  },
  setUserData (userData) {
    dispatch(insertUserData(userData))
  },
  setMenuList (arr) {
    dispatch(insertMenuList(arr))
  }
}))
class index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobile: '',
      password: '',
      menuList: [
        {
          name: '货架',
          clickState: false,
          num: 0,
          icon: 'icon_tab_shelf_normal',
          url: '/pages/purchase/goodsShelf/goodsShelf'
        },
        {
          name: '购物车',
          clickState: false,
          num: 0,
          icon: 'icon_tab_shoppingcart_normal',
          url: '/pages/purchase/shoppingCart/shoppingCart'
        },
        {
          name: '订单',
          clickState: false,
          num: 0,
          icon: 'icon_tab_order_normal',
          url: '/pages/purchase/orderForm/orderForm'
        }
      ]
    }
    this.changeInput = this.changeInput.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.onLogin = this.onLogin.bind(this)
  }

  config = {
    navigationBarTitleText: '登录',
    navigationStyle: 'custom'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  // 不要在 componentWillUpdate/componentDidUpdate/render 中调用 this.setState
  // 尽量避免在 componentDidMount 中调用 this.setState，可以在 componentWillMount 中处理
  // 页面初次渲染完成时触发，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
  componentDidMount () {
    console.log(this.state.menuList)
    this.props.setMenuList(JSON.parse(JSON.stringify(this.state.menuList)))
    // 判断是否有登录信息
    if (this.props.counter.token || Taro.getStorageSync('token')) {
      Taro.navigateTo({
        // url: '/pages/home/index' // 登录页
        // url: '/pages/home/index' // 首页
        // url: '/pages/information/index' // 消息中心
        // url: '/pages/InformationForDetails/index' // 资讯详情
        // url: '/pages/reportForms/manage/index' // 经营分析
        // url: '/pages/purchase/goodsShelf/goodsShelf' // 货架
        // url: '/pages/purchase/shoppingCart/shoppingCart' // 购物车
        url: '/pages/purchase/orderForm/orderForm' // 订单
        // url: '/pages/purchase/orderForm/orderParticulars' // 大订单详情
        // url: '/pages/purchase/orderForm/childrenOrderParticulars' // 子订单详情
        // url: '/pages/purchase/libraryOfGoods/libraryOfGoodsList' // 商品库
        // url: '/pages/purchase/libraryOfGoods/particulars/particulars' // 商品详情
        // url: '/pages/purchase/libraryOfGoods/takeStock/takeStock' // 盘点 | 盘点编辑
        // url: '/pages/earlyWarning/index' // 预警设置
        // url: '/pages/purchase/libraryOfGoods/inventoryRecords/inventoryRecords' // 盘点记录
        // url: '/pages/backgroundTheUser/backgroundTheUser' // 后台用户
        // url: '/pages/backgroundTheUser/particulars/index' // 后台详情
      })
    }
  }

  // 页面卸载时触发，如 redirectTo 或 navigateBack 到其他页面时
  componentWillUnmount () { }

  // 页面加载时触发，一个页面只会调用一次，此时页面 DOM 尚未准备好，还不能和视图层进行交互
  componentWillMount () { }

  // 页面显示/切入前台时触发
  // componentDidShow () { }

  // 页面隐藏/切入后台时触发， 如 navigateTo 或底部 tab 切换到其他页面，小程序切入后台等
  // componentDidHide () { }

  // 监听用户下拉刷新事件 需要在全局配置的 window 选项中或页面配置中开启 enablePullDownRefresh
  // onPullDownRefresh() {}

  // 监听用户上拉触底事件 可以在全局配置的 window 选项中或页面配置中设置触发距离 onReachBottomDistance
  // onReachBottom() {}
  onLogin = () => {
    let data = {
      mobile: this.state.mobile,
      password: this.state.password
    }
    login(data).then(res => {
      this.props.setUserData(res.info)
      this.props.setToken(res.info.token)
      this.props.setMenuList(JSON.parse(JSON.stringify(this.state.menuList)))
      Taro.setStorageSync('token',res.info.token)
      Taro.navigateTo({
        url: '/pages/home/index'
      })
    }).catch(err => {
      console.log(err)
    })
  }

  changeInput = (e) => {
    this.setState({
      mobile: e.detail.value
    })
  }

  changePassword = (e) => {
    this.setState({
      password: e.detail.value
    })
  }

  render () {
    return (
      <View className='index' style={`background: url(${imgPng})`}>
        <View className='boxForm'>
          <View className='textForm'>
            <Text className='textForm-text'>蔬哥果妹</Text>
            <Text className='textForm-text-b'>掌柜端</Text>
          </View>
          <View className='inputForm'>
            <Input type='text' value={this.start.mobile} onInput={this.changeInput} className='inputCustom' placeholder='请输入手机号' focus/>
            <Input type='password' className='inputCustom' onInput={this.changePassword} password placeholder='请输入登录密码'/>
          </View>
          <View className='buttonForm'>
            <Button  className='buttonForm-button' plain type='primary' onClick={this.onLogin} >登录</Button>
          </View>
        </View>
      </View>
    )
  }
}

export default index
