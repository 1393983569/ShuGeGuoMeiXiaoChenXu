import Taro, { Component, render } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtActivityIndicator } from 'taro-ui'
import { getImgCode, checkRandCode, sendSms } from '../../api/public'
import './index.scss'

export default class EditPassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imgeBase: '',
      isOpened: false,
      moblie: '',
      strCode: '',
      interval: '',
      codeData: '',
      mobile: ''
    }
  }

  config = {
    navigationBarTitleText: '修改密码'
  }

  // 验证码
  handleChangeCode(e) {
    console.log(e)
  }

  // 新密码
  handleChangeNewPassword(e) {
    console.log(e)
  }

  isOpenedState(state) {
    this.setState({
      isOpened: state
    })
  }

  // 获取图形验证
  getImgeCode() {
    this.isOpenedState(true)
    getImgCode().then(res => {
      this.setState({
        imgeBase: 'data:image/png;base64,' + res.info.imgCode,
        strCode: res.info.strCode
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 图形验证码输入
  handleChangeOpenCode(e) {
    this.setState({
      imgCode: e
    })
  }

  // 图片验证码取消
  cancelImg() {
    this.setState({
      isOpened: false
    })
  }

  // 图片验证码确认
  confirmImg() {
    // checkRandCode(this.state.imgCode).then(res => {
    //   this.setState({
    //     isOpened: false
    //   }, () => {
    //     this.openSendSms()
    //   })
    // }).catch(err => {
    //   console.log(err)
    // })
    if (this.state.imgCode === this.state.strCode) {
      this.sendVerificationCode()
      this.setState({
        imgCode: '',
        isOpened: false
      })
    }
  }

  // 发送验证码
  openSendSms(phone) {
    sendSms().then(res => {

    }).catch(err => {
      console.log(err)
    })
  }

  // 倒计时
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

  // 发短信
  sendSmsCode(mobile) {
    sendSms(mobile).then(res => {

    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const { isOpened, imgeBase, mobile } = this.state
    return <View className='edit-password-box'>
      <View className='edit-password-box-content'>
        <View className='edit-password-box-content-phone'>
          手机号: { mobile }
        </View>
        <View className='edit-password-box-content-code'>
          <View className='edit-password-box-content-code-left'>
            <AtInput
              className='my-input'
              name='code'
              type='text'
              placeholder='请输入验证码'
              value={this.state.value}
              onChange={this.handleChangeCode.bind(this)}
            />
          </View>
          <View className='edit-password-box-content-code-right' onClick={() => this.getImgeCode()}>
            发送验证码
          </View>
        </View>
        <View className='edit-password-box-content-nwe-password'>
          <AtInput
              name='newPassword'
              type='text'
              placeholder='请输入新密码'
              value={this.state.value}
              onChange={this.handleChangeNewPassword.bind(this)}
            />
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
    </View>
  }
}
