import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import ZdyButtonWidth from '../../../component/ZdyButtonWidth'
import { selectRole } from '../../../api/backgroundTheUser/edit'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: '编辑用户'
  }

  constructor () {
    super(...arguments)
    this.state = {
      value: '',
      selector: [],
      pickerValue: [],
      selectorChecked: '',
      shopObj: {},
      pickerIndex: '',
      pickerId: ''
    }
  }

  componentDidMount() {
    this.getSelectRole()
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
      }, () => {
        // 获取url传入的值
        this.setRouterData()
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 回显角色
  echoRole(roleName) {
    const dataList =  this.state.pickerValue.filter(item => {
      console.log(item.name, roleName, item.name === roleName)
      return item.name === roleName
    })
    this.setState({
      selectorChecked: dataList[0].name
    })
  }

  handleChange (value) {
    this.setState({
      value
    })
  }

  // 获取传入的值
  setRouterData() {
    const parmas = this.$router.params
    console.log(parmas)
    const data = {
      id: parmas.id,
      mobiele: parmas.mobiele + '' !== 'undefined' || '暂无',
      name: parmas.name,
      roleName: parmas.roleName,
      password: parmas.password
    }
    this.setState({
      shopObj: data
    }, () => {
      this.echoRole(parmas.roleName)
    })
  }

  // 点击保存
  onClickEdit() {
    console.log(this.state.shopObj, this.state.mobiele)
  }

  // 选择角色
  onChange(e) {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
      pickerIndex: e.detail.value,
      pickerId: this.state.pickerValue[e.detail.value].id
    })
  }

  // 填写姓名
  handleChangeName(e) {
    const shopObj = this.state.shopObj
    shopObj.name = e
    this.setState({
      shopObj
    })
  }

  // 填写电话
  handleChangeMobiele(e) {
    const shopObj = this.state.shopObj
    shopObj.mobiele = e
    this.setState({
      shopObj
    })
  }

  // 填写密码
  handleChangePassword(e) {
    const shopObj = this.state.shopObj
    shopObj.password = e
    this.setState({
      shopObj
    })
  }

  render() {
    return(
      <View className='box-edit'>
        <View className='box-edit-content'>
          <View className='box-edit-content-querydata'>
            <AtInput
              className='my-atInput'
              name='name'
              title='姓名:'
              type='text'
              placeholder='姓名'
              value={this.state.shopObj.name}
              onChange={() => this.handleChangeName()}
            />
             <AtInput
              className='my-atInput'
              name='mobiele'
              title='手机号:'
              type='number'
              placeholder='手机号'
              value={this.state.shopObj.mobiele}
              onChange={() => this.handleChangeMobiele()}
            />
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='box-edit-content-picker'>
                  <Text className='box-edit-content-picker-text'>当前选择：</Text>
                  <Text className='box-edit-content-picker-selecttext'>{this.state.selectorChecked}</Text>
                </View>
              </Picker>
            </View>
            <AtInput
              className='my-atInput'
              name='password'
              title='初始密码:'
              type='number'
              placeholder='666666'
              value={this.state.shopObj.password}
              onChange={() => this.handleChangePassword()}
            />
          </View>
        </View>
        <View className='contentbotton'>
          <View className='contentbotton-flex'>
            <ZdyButtonWidth name='保存' color='#fff' backgroundColor='#8BC34A' onClickButton={() => this.onClickEdit()}/>
          </View>
        </View>
      </View>
    )
  }
}
