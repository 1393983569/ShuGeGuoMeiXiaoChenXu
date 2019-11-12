import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { AtSwitch, AtMessage } from 'taro-ui'
import { findDiscount } from '../../api/marketingPlatform/marketingPlatformDes'
import { editStatus } from '../../api/marketingPlatform/marketingPlatformlList'
import './marketingPlatformDes.scss'

export default class MarketingPlatformDes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: '',
      data: {},
      categoryOneNameList: [],
      openState: 0
    }
  }

  config = {
    navigationBarTitleText: '营销包详情'
  }

  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    findDiscount(this.state.id).then(res => {
      console.log(this.shopCategory(res.info.goods))
      this.setState({
        data: res.info,
        categoryOneNameList: this.shopCategory(res.info.goods),
        openState: res.info.status
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 筛选出同一品类的商品
  shopCategory(list) {
    const data = {}
    const _list = []
    list.forEach(item => {
      if (data[item.categoryOneName]) {
        data[item.categoryOneName].push(item)
      } else {
        data[item.categoryOneName] = []
        data[item.categoryOneName].push(item)
      }
    })
    for (const key in data) {
      _list.push({
        name: key,
        value: data[key]
      })
    }
    return _list
  }

  // 状态改变
  handleChange(e) {
    editStatus(this.state.id, e ? 1 : 0).then(res => {
      this.handleClick('success', '成功')
    }).catch(err => {
      this.handleClick('warning', err)
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
    const { data, categoryOneNameList } = this.state
    return <View className='box'>
    <AtMessage/>
    <View className='box-content'>
      <View className='box-content-head'>
        <View className='box-content-head-left'>
          { data.name }
        </View>
        <View className='box-content-head-right'>
          <AtSwitch className='my-at-switch' checked={this.state.openState} onChange={this.handleChange.bind(this)} />
        </View>
      </View>
      {
        categoryOneNameList.map(item => {
          return <View className='box-content-list' key={ item.name } style='margin-top: 10Px;'>
          <View className='box-content-list-title'>
            { item.name }
          </View>
          <View className='box-content-list-table'>
            <View className='box-content-list-table-head' style='background-color: #E7F2DA; line-height: 40Px;'>
              <View>商品名称</View>
              <View>折扣率</View>
              <View>原价</View>
              <View>折扣价</View>
            </View>
          </View>
          {
            item.value.map(_item => {
              const price = Math.floor(_item.price) / 100
              const discountRate = Math.floor(_item.price * (_item.discountRate / 100)) / 100
              return <View className='box-content-list-table' key={_item.goodsId}>
                <View className='box-content-list-table-head'>
                  <View>{ _item.goodsName || '暂无' }</View>
                  <View>DR={ _item.discountRate || '暂无' }</View>
                  <View>￥{ price || '暂无' }</View>
                  <View>￥{ discountRate || '暂无' }</View>
                </View>
              </View>
            })
          }
        </View>
        })
      }
    </View>
  </View>
  }

}
