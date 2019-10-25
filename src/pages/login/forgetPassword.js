import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { login } from '../../api/user'
// import imgPng from '../../img/img_bg.png'
import { add, minus, insertToken, insertUserData, insertMenuList } from '../../actions/counter'
import { sendSms, editPwd } from '../../api/login/forgetPassword'

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
  }
}))
class ForgetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobile: '',
      password: '',
      codeData: 60,
      code: '',
      interval: ''
    }
  }

  config = {
    navigationBarTitleText: '忘记密码',
    navigationStyle: 'custom'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  // 不要在 componentWillUpdate/componentDidUpdate/render 中调用 this.setState
  // 尽量避免在 componentDidMount 中调用 this.setState，可以在 componentWillMount 中处理
  // 页面初次渲染完成时触发，一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
  componentDidMount () {
    // 判断是否有登录信息
    if (Taro.getStorageSync('token')) {
      Taro.redirectTo({
        url: '/pages/home/index' // 首页
      })
    }
  }

  onLogin = () => {
    let data = {
      adminId: Taro.getStorageSync('adminId').id,
      confirmPwd: this.state.password,
      msgCode: this.state.code,
      password: this.state.password
    }
    editPwd(data).then(res => {
      this.props.setUserData(res.info)
      this.props.setToken(res.info.token)
      Taro.setStorageSync('token',res.info.token)
      Taro.redirectTo({
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

  // 输入验证码
  changeCode(e) {
    this.setState({
      code: e.detail.value
    })
  }

  // 输入密码
  changePassword(e) {
    this.setState({
      password: e.detail.value
    })
  }

  // 发短信
  sendSmsCode(mobile) {
    sendSms(mobile).then(res => {

    }).catch(err => {
      console.log(err)
    })
  }

  sendVerificationCode() {
    if (this.state.interval) {
      return
    }
    let time = this.state.codeData
    this.sendSmsCode(this.state.mobile)
    let interval = setInterval(() => {
      time--
      if (time < 1) {
        clearInterval(interval)
        this.setState({
          codeData: 60,
          interval: ''
        })
      } else {
        this.setState({
          codeData: time,
          interval
        })
      }
    }, 1000)
  }



  render () {
    const { codeData } = this.state
    return (
      <View className='forgetPassword' style={`background: url(http://qiniu.freshergo.com/1570763640184.png)`}>
        <View className='forgetPassword-box-head'>
          <View className='forgetPassword-box-head-left'>
            <View className='iconfont icon_back_arrow forgetPassword-box-head-left-icon'></View>
          </View>
        </View>
        <View className='forgetPassword-box'>
        <View className='forgetPassword-box-boxForm'>
          <View className='forgetPassword-box-boxForm-head'>
            <View className='forgetPassword-box-boxForm-head-text'>蔬哥果妹</View>
            <View className='forgetPassword-box-boxForm-head-textb'>掌柜端</View>
          </View>
          <View className='forgetPassword-box-boxForm-inputForm'>
            <Input type='text' value={this.start.mobile} onInput={this.changeInput} className='inputCustom' placeholder='请输入手机号' focus/>
            <View className='forgetPassword-box-boxForm-inputForm-code'>
              <View className='forgetPassword-box-boxForm-inputForm-code-input'>
                <Input type='text' value={this.start.code} className='inputCustom' onInput={this.changeCode} placeholder='请输入验证码' style='margin-bottom: 0; border: none'/>
              </View>
              <View className='forgetPassword-box-boxForm-inputForm-code-send' onClick={() => this.sendVerificationCode()}>
                <View>
                  {
                    codeData === 60 ? '发送验证码' : codeData
                  }
                </View>
              </View>
            </View>
            <Input type='text' value={this.state.password} className='inputCustom' onInput={this.changePassword} placeholder='请输入新密码'/>
          </View>
          <View className='forgetPassword-box-boxForm-buttonForm'>
            <Button  className='buttonForm-button' plain type='primary' onClick={this.onLogin} >保存</Button>
          </View>
        </View>
      </View>
      </View>
    )
  }
}

export default ForgetPassword
