import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { AtInput, AtToast, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { login } from '../../api/user'
// import imgPng from '../../img/img_bg.png'
import { add, minus, insertToken, insertUserData, insertMenuList } from '../../actions/counter'
import { forgetPwd } from '../../api/login/forgetPassword'
import { getImgCode, sendSms } from '../../api/public'
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
      interval: '',
      isOpened: false,
      imgeBase: '',
      imgCode: '',
      isOpenedAtToast: false,
      isOpenedSub: false,
      atToastText: ''
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
      mobile: this.state.mobile,
      msgCode: this.state.code,
      password: this.state.password
    }
    forgetPwd(data).then(res => {
      console.log(res, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
      this.props.setUserData(res.info)
      this.props.setToken(res.info.token)
      Taro.setStorageSync('token',res.info.token)
      Taro.setStorageSync('adminId', {
        id: res.info.id,
        shopId: res.info.shopId
      })
      Taro.redirectTo({
        url: '/pages/home/index'
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        atToastText: err
      }, () => {
        this.setState({
          isOpenedSub: true
        }, () => {
          setTimeout(() => {
            this.setState({
              atToastText: '',
              isOpenedSub: false
            })
          }, 3000)
        })
      })
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

  // 点击发送验证码
  sendVerificationCode() {
    if (/[\s\.]/g.test(this.state.mobile) || this.state.mobile.length > 11) {
      this.setState({
        isOpenedSub: true,
        atToastText: '请输入正确的手机号'
      }, () => {
        setTimeout(() => {
          this.setState({
            atToastText: '',
            isOpenedSub: false
          })
        }, 3000)
      })
      return
    }
    if (!this.state.mobile) {
      this.setState({
        isOpenedAtToast: true
      })
      return
    } else {
      this.setState({
        isOpenedAtToast: false
      })
    }
    let time = this.state.codeData
    this.getImgeCode()
  }

  // 输入验证码
  handleChangeOpenCode(e) {
    this.setState({
      imgCode: e
    })
  }

  // 显示输入图形验证图片
  isOpenedState(state) {
    this.setState({
      isOpened: state
    })
  }

   // 图片验证码取消
   cancelImg() {
    this.setState({
      isOpened: false,
      isOpenedSub: false
    })
  }

  // 获取图形验证
  getImgeCode() {
    if (this.state.codeData !== 60) return
    this.isOpenedState(true)
    getImgCode().then(res => {
      this.setState({
        imgeBase: 'data:image/png;base64,' + res.info.imgCode,
        strCode: res.info.strCode,
        imgCode: ''
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 图片验证码确认
  confirmImg() {
    if (this.state.imgCode === this.state.strCode) {
      this.sendCode()
      this.setState({
        imgCode: '',
        isOpened: false
      })
    } else {
      this.setState({
        atToastText: '请输入正确的验证码',
        isOpenedSub: true
      }, () => {
        setTimeout(() => {
          this.setState({
            atToastText: '',
            isOpenedSub: false
          })
        }, 3000)
      })
    }
  }

  // 倒计时
  sendCode() {
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

  // 返回
  getBack() {
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

  render () {
    const { codeData, isOpened, imgeBase, isOpenedAtToast, isOpenedSub, atToastText } = this.state
    return (
      <View className='forgetPassword' style={`background: url(http://qiniu.freshergo.com/1570763640184.png)`}>
      <AtToast isOpened={isOpenedSub} text={atToastText} ></AtToast>
        <View className='forgetPassword-box-head'>
          <View className='forgetPassword-box-head-left' onClick={() => this.getBack()}>
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
            <Input type='text' value={this.state.mobile} onInput={this.changeInput} className='inputCustom' placeholder='请输入手机号' focus/>
            <View className='forgetPassword-box-boxForm-inputForm-code'>
              <View className='forgetPassword-box-boxForm-inputForm-code-input'>
                <Input type='text' value={this.state.code} className='inputCustom' onInput={this.changeCode} placeholder='请输入验证码' style='margin-bottom: 0; border: none'/>
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
      <AtModal isOpened={isOpened}>
        <AtModalHeader>验证码</AtModalHeader>
        <AtModalContent>
          <Image src={ 'data:image/jpeg' + imgeBase } style="height: 150Px"/>
          <AtInput
            name='code'
            type='text'
            placeholder='请输入验证码'
            value={this.state.imgCode}
            onChange={this.handleChangeOpenCode.bind(this)}
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => this.cancelImg()}>取消</Button>
          <Button onClick={() => this.confirmImg()}>确定</Button>
        </AtModalAction>
      </AtModal>
      <AtToast isOpened={isOpenedAtToast} text="请输入手机号" icon="close-circle"></AtToast>
      </View>
    )
  }
}

export default ForgetPassword
