import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { queryDiscount, editStatus } from '../../api/marketingPlatform/marketingPlatformlList'
import { AtSwitch, AtMessage } from 'taro-ui'

import './marketingPlatformlList.scss'

export default class MarketingPlatformlList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      shopId: '',
      dataList: []
    }
  }

  config = {
    navigationBarTitleText: '营销平台'
  }

  componentWillMount() {
    this.setState({
      shopId: Taro.getStorageSync('adminId').shopId
    })
  }

  componentDidMount() {
    this.getList()
  }

  // 获取数据列表
  getList() {
    queryDiscount(this.state.pageNum, this.state.shopId).then(res => {
      console.log(res)
      this.setState({
        dataList: res.info.records
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 状态改变
  handleChange(item, e) {
    editStatus(item.id, e ? 1 : 0).then(res => {
      this.handleClick('success', '成功')
    }).catch(err => {
      this.handleClick('warning', err)
    })
  }

  // 跳转详情
  toDes(id) {
    Taro.navigateTo({
      url: '/pages/marketingPlatform/marketingPlatformDes?id=' + id
    })
  }

  // 消息提示
  handleClick (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  render() {
    const { dataList } = this.state
    return <View className='box'>
     <AtMessage />
      {
        dataList.map(item => {
          return <View className='box-content' key={item.id}>
            <View className='box-content-head'>
              <View className='box-content-head-left'>
                { item.name }
              </View>
              <View className='box-content-head-right'>
                <AtSwitch className='my-at-switch' checked={ item.status + '' === '1' ? true : false } onChange={this.handleChange.bind(this, item)} />
              </View>
            </View>
            <View className='box-content-bottom'>
              <View className='box-content-bottom-text'>
                {
                  item.goods.map(_item => {
                    return _item.goodsName
                  }).join(',')
                }
              </View>
              <View className='box-content-bottom-icon' onClick={() => this.toDes(item.id)}>
                <View className='iconfont icon_rightarrow' style='font-size: 18Px'></View>
              </View>
            </View>
          </View>
        })
      }
    </View>
  }

}
