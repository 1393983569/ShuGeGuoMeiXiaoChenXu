import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import { findByOrderIdOne } from '../../../api/purchase/orderParticulars'

export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stateList: [],
      stateData: {},
      orderId: '',
      stateName: ''
    }
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  componentDidMount() {
    this.getOrderData(this.$router.params.orderId)
  }

  // 获取订单数据
  getOrderData(orderId) {
    this.setState({
      orderId,
      stateName: this.$router.params.state
    })
    findByOrderIdOne(orderId).then(res => {
      console.log(res)
      try {
        const stateList = res.info.map((item, index) => {
          return {
            id: item.id,
            orderNo: item.orderNo,
            createTime: item.createTime,
            type: item.type,
            totalMoney: item.totalMoney,
            shopId: item.shopId,
            orderDetailList: this.getRuleList(item.orderDetailList, 'category_one_id', 'goodsName'),
            subOrderList: item.subOrderList,
            shopDomain: {
              adminName: item.shopDomain.adminName,
              adminPhone: item.shopDomain.adminPhone,
              provinceDomain: item.shopDomain.provinceDomain.name,
              cityDomain: item.shopDomain.cityDomain.name,
              areaDomain: item.shopDomain.areaDomain.name,
              detailsAddress: item.shopDomain.detailsAddress,
            },
            statusCount: item.statusCount,
            subOrderCount: item.subOrderCount
          }
        })
        console.log(stateList[0])
        this.setState({
          stateData: stateList[0]
        })
      } catch(e) {
        console.log(e, '53行')
      }
    }).catch(err => {

    })
  }

  // 按名称合并数组
  getRuleList(list, name, categoryName) {
    console.log(list, name)
    let map = {}
    const _list = []
    list.forEach((item, index) => {
      if (!map[item[name]]) {
        map[item[name]] = {
          name: item[name],
          num: 1,
          list: [item],
          index,
          category: item[categoryName]
        }
      } else {
        map[item[name]].num += 1
        map[item[name]].list.push(item)
      }
    })
    for (let key in map) {
      _list.push(map[key])
    }
    return _list
  }

  // 跳转子订单详情
  goChildrenOrder(orderId, e) {
    Taro.navigateTo({
      url: '/pages/purchase/orderForm/childrenOrderParticulars?orderId=' + orderId
    })
  }

  renderOrder() {
    const { stateData } = this.state
    if (Object.keys(stateData).length === 0) {
      return (
        <View></View>
      )
    }
    return(
      <View className='orderList'>
        <View className='orderList-head'>
          订单明细
        </View>
        <View className="tr-th">
          <View className="th">商品名称</View>
          <View className="th">商品ID</View>
          <View className="th">规格</View>
          <View className="th">单价</View>
          <View className="th">订单数量</View>
          <View className="th">小计金额</View>
        </View>
        {
          stateData.orderDetailList.map((item, index) => {
            return(
              <View key={index + 'category'}>
                <View className='category'>
                  <View className='category-text'>
                    <Text>
                      {item.category}
                    </Text>
                  </View>
                  <View className='category-solid'>
                  </View>
                </View>
                {
                  item.list.map((_item, _index) => {
                    return(
                      <View className="tr" key={_index + 'tr'}>
                        <View className="td">{_item.goodsName}</View>
                        <View className="td">{_item.id}</View>
                        <View className="td">{_item.standards}</View>
                        <View className="td">￥{_item.price}</View>
                        <View className="td">30</View>
                        <View className="td">￥{_item.money}</View>
                      </View>
                    )
                  })
                }
              </View>
            )
          })
        }
      </View>
    )
  }

  renderChildOrder() {
    const { stateData } = this.state
    return(
      <View className='childOrderList'>
        <View className='childOrderList-heat'>
          子订单列表
        </View>
        {
          stateData.subOrderList ? stateData.subOrderList.map((item, index) => {
            return(
              <View className='childOrderList-content' key={index + '_ch'}>
                <View className='childOrderList-content-text'>
                  <Text>子订单编号：</Text>
                  <Text>{item.suborder_no}</Text>
                </View>
                <View className='childOrderList-content-text'>
                  <Text>子订单时间：</Text>
                  <Text>{item.create_time}</Text>
                </View>
                <View className='childOrderList-content-text'>
                  <Text>供应商：</Text>
                  <Text>{item.providerName}</Text>
                </View>
                <View className='childOrderList-content-text'>
                  <View>
                    <Text>订单金额：</Text>
                    <Text>￥{item.money}</Text>
                  </View>
                  <View>
                    <Button size='mini' className='childOrderList-content-button'>已派单</Button>
                  </View>
                  <View onClick={this.goChildrenOrder.bind(this, item.suborder_no)}>
                    <View className='iconfont icon_rightarrow' style='font-size: 14Px; color: #8BC34A'></View>
                  </View>
                </View>
              </View>
            )
          }) : ''
        }
      </View>
    )
  }

  render () {
    const scrollStyle = {
      height: '100%'
    }
    return (
      <View className='orderParticulars'>
        <View className='orderParticulars-box'>
          <ScrollView
            className='scrollview'
            scrollY
            scrollWithAnimation
            style={scrollStyle}
          >
          {/* 滑动部分 */}
            <View className='orderParticulars-state'>
              <View className='iconfont icon_orderstatus_distributed orderParticulars-state-icon'></View>
              {this.state.stateName}
            </View>
            <View className='orderParticulars-message'>
              <View className='orderParticulars-message-flex'>
                <Text className='orderParticulars-message-placeholder'></Text>
                <Text className='orderParticulars-message-text'>
                  {stateData.shopDomain.adminName}
                  {stateData.shopDomain.adminPhone}
                </Text>
              </View>
              <View className='orderParticulars-message-flex'>
                <View>
                  <View className='iconfont icon_shoplocation orderParticulars-message-icon'></View>
                </View>
                <View style='line-height: 26Px;'>
                  <Text style='word-break: break-all;word-wrap: break-word;'>
                    {stateData.shopDomain.provinceDomain}
                    {stateData.shopDomain.cityDomain}
                    {stateData.shopDomain.areaDomain}
                    {stateData.shopDomain.detailsAddress}
                  </Text>
                </View>
              </View>
            </View>
            <View className='orderMessage'>
              <View className='orderMessage-head'>
                <Text className='orderMessage-head-left'>
                  订单信息
                </Text>
                <Text className='orderMessage-head-right'>
                  已派单  {stateData.statusCount}/{stateData.subOrderCount}
                </Text>
              </View>
              <View className='orderMessage-content'>
                <Text className='orderMessage-content-text'>
                  订单编号：
                </Text>
                <Text className='orderMessage-content-text-color'>
                  {stateData.orderNo}
                </Text>
              </View>
              <View className='orderMessage-content'>
                <Text className='orderMessage-content-text'>
                  订单时间：
                </Text>
                <Text>
                  {stateData.createTime}
                </Text>
              </View>
            </View>
            {this.renderOrder()}
            {this.renderChildOrder()}
          </ScrollView>
        </View>
      </View>
    )
  }
}
