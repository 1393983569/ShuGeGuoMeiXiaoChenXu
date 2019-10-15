import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { selectPageAdmin } from '../../api/backgroundTheUser/backgroundTheUser'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: '后台用户'
  }

  constructor(props) {
    super(props)
    this.state = {
      shopId: Taro.getStorageSync('adminId').shopId,
      pageNum: 1,
      dataList: []
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    let list = JSON.parse(JSON.stringify(this.state.dataList))
    selectPageAdmin(this.state.pageNum, this.state.shopId).then(res => {
      const _list = res.info.records.map(item => {
        return {
          name: item.name,
          id: item.id,
          roleId: item.roleId,
          description: item.role.description,
          type: item.role.type,
          roleName: item.role.name !== null ? item.role.name : '暂无',
          createTime: item.createTime,
          mobile: item.mobile
        }
      })
      list = [...list, ..._list]
      this.setState({
        dataList: list
      }, () => {
        console.log(list)
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 查看详情
  clickRole(name, id) {
    Taro.navigateTo({
      url: '/pages/backgroundTheUser/particulars/index?name=' + name + '&id=' + id
    })
  }

  render() {
    const { dataList } = this.state
    return(
      <View className='box'>
        <View style='padding: 11Px 14Px; background-color: #ffffff;overflow: hidden'>
          <View style='float: right; color: #8BC34A; font-size: 14Px'>
            角色
          </View>
        </View>
        {
          dataList.map(item => {
            return <View className='box-content' key={ item.id }>
              <View className='box-content-item'>
                <View className='box-content-item-left'>
                  <View style='font-size: 14Px; width: 50%'>
                    { item.name }
                  </View>
                  <View  style='font-size: 14Px;color: #999999; '>
                    { item.mobile }
                  </View>
                </View>
                <View className='box-content-item-right' onClick={() => this.clickRole(item.name + ' ' + item.roleName, item.id)}>
                  <View style='font-size: 14Px;'>
                    { item.roleName }
                  </View>
                  <View style='font-size: 12Px;color: #999999;'>
                    注册时间：{ item.createTime }
                  </View>
                  <View>
                    <View className='iconfont icon_rightarrow' style='font-size:17Px;color:#8BC34A'></View>
                  </View>
                </View>
              </View>
            </View>
          })
        }
      </View>
    )
  }
}
