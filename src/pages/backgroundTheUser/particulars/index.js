import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { selectDetails, deleteShopStaff } from '../../../api/backgroundTheUser/particulars'
import ZdyButtonWidth from '../../../component/ZdyButton/index'
import './index.scss'
// 后台用户-详情
export default class Index extends Component{

  config = {
    navigationBarTitleText: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      queryData: {},
      shopObj: {}
    }
  }

  componentWillMount() {
    Taro.setNavigationBarTitle({
      title: this.$router.params.name
    })
    const data = {
      name: this.$router.params.name,
      id: this.$router.params.id
    }
    this.setState({
      queryData: data
    }, () => {
      this.getList()
    })
  }

  componentDidMount() {

  }

  // 获取用户信息
  getList() {
    selectDetails(this.$router.params.id).then(res => {
      this.setState({
        shopObj: res.info
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 删除用户
  onClickDel(id) {
    deleteShopStaff(id).then(res => {
      Taro.navigateTo({
        url: '/pages/backgroundTheUser/backgroundTheUser'
      })
    }).catch(err => {
      console.log(err)
    })
  }
  // 编辑用户
  onClickEdit(id) {
    const { shopObj } = this.state
    Taro.navigateTo({
      url: `/pages/backgroundTheUser/edit/index?id=${shopObj.id}&name=${shopObj.name}&mobile=${shopObj.mobile}&roleName=${shopObj.role.name}&password=${shopObj.shopDomain.adminPassword}`
    })
  }

  render() {
    const { shopObj } = this.state
    return(
      <View className='box'>
      {
          Object.keys(shopObj).length !== 0 ? <View>
            <View className='box-content'>
              <View>
                ID：{ shopObj.id }
              </View>
              <View>
                姓名：{ shopObj.name }
              </View>
              <View>
                手机号：{ shopObj.mobile || '暂无' }
              </View>
              <View>
                角色：{ shopObj.role.name }
              </View>
              <View>
                注册日期：{ shopObj.shopDomain.createTime }
              </View>
            </View>
            {
              shopObj.role.name !== '店长' ?   <View className='box-botton'>
              <View className='box-botton-flex'>
                  <View style='width: 40%'>
                    <ZdyButtonWidth lineHeight='35px' name='编辑' className='ZdyButtonWidth' color='#fff' backgroundColor='#8BC34A' onClickButton={() => this.onClickEdit(shopObj.id)}/>
                  </View>
                  <View style='width: 40%'>
                    <ZdyButtonWidth lineHeight='35px' name='删除' className='ZdyButtonWidth' color='#E51C23' backgroundColor='#fff' onClickButton={() => this.onClickDel(shopObj.id)}/>
                  </View>
                </View>
              </View> : ''
            }
            </View> : ''
        }
      </View>
    )
  }

}
