import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtInput, AtMessage } from "taro-ui"
import ZdyButton from '../../component/ZdyButton'
import { deleteShopStaff, editShopStaff, addShopStaff } from '../../api/setUpShop/officeList'
import { selectRole } from '../../api/public'
import './index.scss'

export default class OfficeList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      userData: {
        mobile: '',
        password: '',
        name: '',
        roleId: ''
      },
      roleList: [],
      roleNameList: [],
      roleName: '',
      status: '',
      roleData: ''
    }
  }

  config = {
    navigationBarTitleText: '职员情况'
  }

  componentDidMount() {
    this.getRole()
  }

  // 获取角色列表
  getRole() {
    selectRole().then(res => {
      const list = res.info.filter(item => {
        return item.name !== '店长'
      })
      const nameList = list.map(item => {
        return item.name
      })
      this.setState({
        roleList: list,
        roleNameList: nameList,
        roleData: res.info
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 角色数据回显
  getRoleIndex(id) {
    let name = null
    this.state.roleData.forEach((item, index) => {
      if (item.id === id) {
        name = {
          name: item.name,
          id: item.id
        }
      }
    })
    return name
  }

  // 编辑
  editOffice(row) {
    const data = {
      mobile: row.shopDomain.adminPhone,
      password: row.shopDomain.adminPassword,
      name: row.shopDomain.adminName,
      roleId: this.getRoleIndex(row.role.id).id
    }
    this.setState({
      isOpened: true,
      userData: data,
      status: 'edit',
      roleName: this.getRoleIndex(row.role.id).name
    })
  }

  // 添加
  onClickAdd() {
    const data = {
      mobile: '',
      password: '',
      name: '',
      roleId: ''
    }
    this.setState({
      isOpened: true,
      userData: data,
      status: 'add',
      roleName: ''
    })
  }

  // 删除
  delOffice(row) {
    const { refreshList } = this.props
    deleteShopStaff(row.id).then(res => {
      console.log(res)
      refreshList()
    }).catch(err => {
      console.log(err)
    })
  }

  // 输入姓名
  handleChangeName(e) {
    const userData = this.state.userData
    userData.name = e
    this.setState({
      userData
    })
  }

  // 输入手机号
  handleChangeMobile(e) {
    const userData = this.state.userData
    userData.mobile = e
    this.setState({
      userData
    })
  }

  // 输入密码
  handleChangePassword(e) {
    const userData = this.state.userData
    userData.password = e
    this.setState({
      userData
    })
  }

  // 取消
  clickCancel() {
    this.setState({
      isOpened: false
    })
  }

  // 提示消息
  handleClick (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  // 确定
  clickConfirm() {
    const { refreshList } = this.props
    const { userData } = this.state
    userData.shopId = Taro.getStorageSync('adminId').shopId
    // 判断是否是编辑
    if (this.state.status === 'edit') {
      editShopStaff(userData).then(res => {
        this.setState({
          isOpened: false
        }, () => {
          refreshList()
          this.handleClick('success', '操作成功')
        })
      }).catch(err => {
        console.log(err)
        this.handleClick('error', '操作失败')
      })
    } else {
      addShopStaff(userData).then(res => {
        console.log(res)
        this.setState({
          isOpened: false
        }, () => {
          refreshList()
          this.handleClick('success', '操作成功')
        })
      }).catch(err => {
        console.log(err)
        this.handleClick('error', '操作失败')
      })
    }
  }

  // 选择角色
  pickerOnChange(e) {
    const data = this.state.userData
    data.roleId = this.state.roleList[e.detail.value].id
    this.setState({
      roleName: this.state.roleNameList[e.detail.value],
      userData: data
    })
  }

  render() {
    const { list } = this.props
    return <View className='officeList-box'>
      <AtMessage />
      <View className='officeList-box-head'>
        <View className='officeList-box-head-left'>
          职员情况：
        </View>
        <View className='officeList-box-head-right'>
          <ZdyButton name='新建' color='#8BC34A' backgroundColor='#fff' onClickButton={() => this.onClickAdd()}/>
        </View>
      </View>
      <View className='officeList-box-content'>
        <View className='officeList-box-content-head'>
          <View className='officeList-box-content-head-text'>姓名</View>
          <View className='officeList-box-content-head-text'>职级</View>
          <View className='officeList-box-content-head-text'>电话</View>
          <View className='officeList-box-content-head-text'>操作</View>
        </View>
        {
          list.map(item => {
            return <View className='officeList-box-content-content' key={ item.id }>
              <View className='officeList-box-content-content-text'>{ item.name }</View>
              <View className='officeList-box-content-content-text'>{ item.role.name }</View>
              <View className='officeList-box-content-content-text'>{ item.mobile }</View>
              <View className='officeList-box-content-content-text-action'>
                <View onClick={() => this.editOffice(item)}>
                  编辑
                </View>
                <View onClick={() => this.delOffice(item)}>
                  删除
                </View>
              </View>
            </View>
          })
        }
      </View>
      <AtModal isOpened={this.state.isOpened}>
        <AtModalHeader>添加人员</AtModalHeader>
        <AtModalContent>
            <AtInput
            className='my-input'
            name='value1'
            title='姓名'
            type='text'
            placeholder='请输入姓名'
            value={this.state.userData.name}
            onChange={this.handleChangeName.bind(this)}
          />
          <AtInput
          className='my-input'
            name='value6'
            border={false}
            title='手机号码'
            type='phone'
            placeholder='手机号码'
            value={this.state.userData.mobile}
            onChange={this.handleChangeMobile.bind(this)}
          />
          <Picker mode='selector' range={this.state.roleNameList} onChange={this.pickerOnChange} value={this.state.userData.roleId}>
            <View className='picker'>
              <View className='picker-job'>职位</View>
              {this.state.roleName ?
              <Text>{ this.state.roleName }</Text> :
              <Text className='picker-text'>请选择职位</Text>}
            </View>
          </Picker>
          <AtInput
            className='my-input'
            name='value3'
            title='密码'
            type='text'
            placeholder='请输入密码'
            value={this.state.userData.password}
            onChange={this.handleChangePassword.bind(this)}
          />
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => this.clickCancel()}>取消</Button>
          <Button onClick={() => this.clickConfirm() }>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  }
}

// 设置props默认值
OfficeList.defaultProps = {
  list: [],
  refreshList: () => {}
}
