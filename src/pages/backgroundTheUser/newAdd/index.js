import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput, AtMessage } from 'taro-ui'
import ZdyButtonWidth from '../../../component/ZdyButtonWidth'
import { selectRole, addAdmin } from '../../../api/backgroundTheUser/newAdd'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: '新建用户'
  }

  constructor () {
    super(...arguments)
    this.state = {
      value: '',
      selector: [],
      selectorChecked: '',
      selectorIndex: '',
      pickerValue: [],
      password: '',
      name: '',
      mobile: ''
    }
  }

  componentDidMount() {
    this.getSelectRole()
  }

  handleChange (value) {
    this.setState({
      value
    })
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
      selectorIndex: e.detail.value
    }, () => {
      console.log(e.detail.value)
    })
  }

  // 获得角色
  getSelectRole() {
    selectRole().then(res => {
      const selector = res.info.filter(item => {
        return item.name !== '店长'
      }).map(item => {
        return item.name
      })
      this.setState({
        selector,
        pickerValue: res.info
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 获得角色数据
  getRoleData(index) {
    return this.state.pickerValue[index] || ''
  }

  // 返回
  returnTo() {
    Taro.redirectTo({
      url: '/pages/backgroundTheUser/backgroundTheUser'
    })
  }

  // 添加
  onClickAdd() {
    const { name, mobile, password } = this.state
    const id = this.getRoleData(this.state.selectorIndex).id
    if (!name) {
      this.handleMessage('warning', '请输入名称')
    } else if (!mobile) {
      this.handleMessage('warning', '请输入手机号')
    } else if (!password) {
      this.handleMessage('warning', '请输入密码')
    } else if (!id) {
      this.handleMessage('warning', '请选择角色')
    } else {
      addAdmin(name, mobile, password, id, Taro.getStorageSync('adminId').shopId).then(res => {
        this.handleMessage('success', '成功')
        this. returnTo()
      }).catch(err => {
        console.log(err)
        this.handleMessage('warning', err.info)
      })
    }
  }

  // 输入姓名
  handleChangeName(e) {
    this.setState({
      name: e
    })
  }

  // 输入手机号
  handleChangeMobile(e) {
    this.setState({
      mobile: e
    })
  }

  // 输入初始密码
  handleChangePassword(e) {
    this.setState({
      password: e
    })
  }

  // 消息提示
  handleMessage (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  render() {
    return(
      <View className='box-edit'>
      <AtMessage />
        <View className='box-edit-content'>
          <View className='box-edit-content-querydata'>
            <AtInput
              className='my-atInput'
              name='name'
              title='姓名:'
              type='text'
              placeholder='请输入用户姓名'
              value={this.state.name}
              onChange={this.handleChangeName.bind(this)}
            />
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='box-edit-content-picker'>
                  <Text className='box-edit-content-picker-text'>当前选择：</Text>
                  {
                    this.state.selectorChecked !== '' ?
                    <Text className='box-edit-content-picker-selecttext'>{this.state.selectorChecked}</Text>:
                    <Text className='box-edit-content-picker-not-to-choose'>请选择角色</Text>
                  }
                </View>
              </Picker>
            </View>
             <AtInput
              className='my-atInput'
              name='mobile'
              title='手机号:'
              type='number'
              placeholder='请输入用户手机号'
              value={this.state.mobile}
              onChange={this.handleChangeMobile.bind(this)}
            />
            <AtInput
              className='my-atInput'
              name='password'
              title='初始密码:'
              type='number'
              placeholder='请输入用户初始密码'
              value={this.state.password}
              onChange={this.handleChangePassword.bind(this)}
            />
          </View>
        </View>
        <View className='contentbotton'>
          <View className='contentbotton-flex'>
            <ZdyButtonWidth name='保存' color='#fff' backgroundColor='#8BC34A' onClickButton={() => this.onClickAdd()}/>
          </View>
        </View>
      </View>
    )
  }
}
