import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput, AtMessage } from 'taro-ui'
import ZdyButtonWidth from '../../../component/ZdyButtonWidth'
import { selectRole, editAdmin } from '../../../api/backgroundTheUser/edit'
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
      const pickerValue = res.info.filter(item => {
        return item.name !== '店长'
      }).map(item => {
        return item
      })
      this.setState({
        selector,
        pickerValue
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
    const dataList =  this.state.pickerValue.filter((item, index) => {
      console.log(item.name, roleName, item.name === roleName)
      //
      if (item.name === roleName) {
        // 赋值当前回显下标
        this.setState({
          pickerIndex: index
        })
      }
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
    const data = {
      id: parmas.id,
      mobile: parmas.mobile + '' !== 'undefined' ? parmas.mobile : '暂无',
      name: parmas.name,
      roleName: parmas.roleName,
      password: parmas.password,
      dataId: parmas.id
    }
    this.setState({
      shopObj: data
    }, () => {
      this.echoRole(parmas.roleName)
    })
  }

  // 消息提示
  handleMessage (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  // 点击保存
  onClickEdit() {
    console.log(this.state.shopObj, )
    const shopObj = this.state.shopObj
    const id = this.state.pickerValue[parseInt(this.state.pickerIndex)].id || ''
    const shopId = Taro.getStorageSync('adminId').shopId
    if (!shopObj.name) {
      this.handleMessage('warning', '请输入名称')
    } else if (shopObj.mobile === null || shopObj.mobile === 'nudefinde') {
      this.handleMessage('warning', '请输入手机号')
    } else if (!shopObj.password) {
      this.handleMessage('warning', '请输入密码')
    } else if (!id) {
      this.handleMessage('warning', '请选择角色')
    } else {
      console.log(Taro.getStorageSync('adminId').shopId)
      editAdmin(shopObj.dataId, shopObj.name, shopObj.mobile, shopObj.password, id, shopId).then(res => {
        this.handleMessage('success', '成功')
      }).catch(err => {
        console.log(err)
        this.handleMessage('error', '失败')
      })
    }
  }

  // 选择角色
  onChange(e) {
    console.log(this.state.pickerValue[e.detail.value].id)
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
    shopObj.mobile = e
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
        <AtMessage />
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
              name='mobile'
              title='手机号:'
              type='number'
              placeholder='手机号'
              value={this.state.shopObj.mobile}
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
