import Taro, { Component, render } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtInput, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtActivityIndicator, AtMessage } from 'taro-ui'
import { getImgCode, checkRandCode, sendSms, forgetPwd } from '../../api/public'
import ZdyButtonWidth from '../../component/ZdyButtonWidth'
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
      codeData: 60,
      mobile: '',
      code: '',
      password: ''
    }
  }

  config = {
    navigationBarTitleText: '修改密码'
  }

  componentWillMount() {
    this.setState({
      mobile: this.$router.params.mobile,
      code: '',
      codeData: 60,
      isOpened: false,
      strCode: '',
      imgeBase: '',
      password: ''
    })
  }

  // 验证码
  handleChangeCode(e) {
    console.log(e)
    this.setState({
      code: e
    })
  }

  // 新密码
  handleChangeNewPassword(e) {
    console.log(e)
    this.setState({
      password: e
    })
  }

  isOpenedState(state) {
    this.setState({
      isOpened: state
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

  // 图形验证码输入
  handleChangeOpenCode(e) {
    this.setState({
      imgCode: e
    })
  }

  // 图片验证码取消
  cancelImg() {
    this.setState({
      isOpened: false,
      imgCode: ''
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
    sendSms(phone).then(res => {

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

  // 修改密码确定
  onClickSub() {
    forgetPwd(Taro.getStorageSync('adminId').id, this.state.password, this.state.coded).then(res => {
      this.handleClick('success', '成功')
      Taro.redirectTo({
        url: '/pages/personalCenter/index'
      })
    }).catch(err => {
      console.log(err)
    })
  }

  handleClick (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  render() {
    const { isOpened, imgeBase, mobile } = this.state
    return <View className='edit-password-box'>
      <AtMessage />
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
          {
            codeData === 60 ? '发送验证码' : codeData
          }
          </View>
        </View>
        <View className='edit-password-box-content-nwe-password'>
          <AtInput
              name='newPassword'
              type='text'
              placeholder='请输入新密码'
              value={this.state.password}
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
      <View className='edit-password-box-bottom'>
        <View className='edit-password-box-bottom-flex'>
          <ZdyButtonWidth name='确定' color='#fff' backgroundColor='#8BC34A' onClickButton={() => this.onClickSub()}/>
        </View>
      </View>
    </View>
  }
}
