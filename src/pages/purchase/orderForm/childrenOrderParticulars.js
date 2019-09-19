import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import { findSubOrder, updateOrderStorage } from '../../../api/purchase/childrenOrderParticulars'

export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shoppingList: [],
      orderId: this.$router.params.orderId
    }
  }

  config = {
    navigationBarTitleText: '订单详情'
  }

  componentDidMount() {
    this.getDataList()
  }

  // 获得数据
  getDataList() {
    findSubOrder(this.state.orderId).then(res => {
      const list = res.info.map((item, index) => {
        return {
          id: item.id,
          createTime: item.createTime,
          suborderNo: item.suborderNo,
          shopId: item.shopId,
          providerDomain: {
            id: item.providerDomain.id,
            name: item.providerDomain.name
          },
          shopDomain: {
            adminName: item.shopDomain.adminName,
            adminPhone: item.shopDomain.adminPhone,
            detailsAddress: item.shopDomain.detailsAddress,
            provinceDomain: item.shopDomain.provinceDomain.name,
            cityDomain: item.shopDomain.cityDomain.name,
            areaDomain: item.shopDomain.areaDomain.name,
          },
          subOrderDetailList: this.mergeList(item.subOrderDetailList, 'category_one_id')
        }
      })
      this.setState({
        shoppingList: list[0]
      })
    }).catch(err => {

    })
  }

  // 合并数组
  mergeList(list, name) {
    let data = {}
    const _list = []
    list.forEach((item, index) => {
      if (!data[item[name]]) {
        data[item[name]] = {
          categoryId: item.sub_order_id,
          categoryName: item.categoryOneName,
          categoryList: [
            {
              name: item.name,
              id: item.goods_id,
              standards: item.standards,
              price: item.price,
              amount: item.amount,
              inputQuantity: item.input_quantity,
              money: item.money,
              modificationState: false
            }
          ]
        }
      } else {
        data[item[name]].categoryList.push({
          name: item.name,
          id: item.goods_id,
          standards: item.standards,
          price: item.price,
          amount: item.amount,
          inputQuantity: item.inputQuantity,
          money: item.money,
          modificationState: false
        })
      }
    })
    for (let key in data) {
      _list.push({
        ...data[key]
      })
    }
    return _list
  }

  // 改变入库数量变色
  onInputWarehouseNum(item, listItem, listIndex, e) {
    console.log(item, listItem, listIndex, e.target.value)
    const { subOrderDetailList } = this.state.shoppingList
    const shoppingList = JSON.parse(JSON.stringify(this.state.shoppingList))
    const orderDetailList = JSON.parse(JSON.stringify(subOrderDetailList))
    const newList = orderDetailList[listIndex].categoryList.map((_item, _index) => {
      if (_item.id === listItem.id) {
        _item.inputQuantity = e.target.value
      }
      return _item
    })
    orderDetailList[listIndex].categoryList = newList
    shoppingList.subOrderDetailList = orderDetailList
    this.setState({
      shoppingList: shoppingList
    })
  }

  // 入库
  putBinStorage() {
    console.log(this.state.shoppingList)
    const list  = []
    this.state.shoppingList.subOrderDetailList.forEach((item, index) => {
      item.categoryList.forEach((_item, _index) => {
        list.push({
          id: _item.id,
          inStorage: _item.inputQuantity ? _item.inputQuantity : 0
        })
      })
    })
    updateOrderStorage().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  renderOrder(list) {
    if (!list || list.length === 0) {
      return
    }
    return(
      <View className='orderList'>
        <View className='orderList-head orderList-layout'>
          <View>
            <Text>订单明细</Text>
          </View>
          <View>
            <Button className='btn-max-w button-custom' type='primary' onClick={this.putBinStorage}>入库</Button>
          </View>
        </View>
        <View className="tr" style='background-color: #E7F2DA;'>
          <View className="th">商品名称</View>
          <View className="th">商品ID</View>
          <View className="th">规格</View>
          <View className="th">单价</View>
          <View className="th">订单数量</View>
          <View className="th">入库数量</View>
          <View className="th">小计金额</View>
        </View>
        {
          list.map((item, index) => {
            return(
              <View key={index+'_l'}>
                <View >
                  <View className='category'>
                    <View className='category-text'>
                      <Text>
                        {item.categoryName}
                      </Text>
                    </View>
                    <View className='category-solid'>
                    </View>
                  </View>
                  {item.categoryList.map((listItem, listIndex) => {
                    console.log(listItem)
                    return <View key={listIndex+'_ca'}>
                      <View className="tr">
                        <View className="td">{listItem.name}</View>
                        <View className="td">{listItem.id}</View>
                        <View className="td">{listItem.standards}</View>
                        <View className="td">{listItem.price}</View>
                        <View className="td" style={listItem.modificationState ? 'color: red' : ''}>
                          <Input className='td-input' type='number' onInput={this.onInputWarehouseNum.bind(this, item, listItem, listIndex)} value={listItem.inputQuantity} maxLength='15'/>
                        </View>
                        <View className="td" style={listItem.modificationState ? 'color: red' : ''}>{listItem.amount}</View>
                        <View className="td">{parseInt(listItem.amount) * parseInt(listItem.price)}</View>
                      </View>
                    </View>
                  })}
                </View>
              </View>
            )
          })
        }
        <View className='aggregate'>
          <Text className='aggregate-left'>
            总计金额
          </Text>
          <Text className='aggregate-right'>
            ￥{item.money}
          </Text>
        </View>
      </View>
    )
  }

  render () {
    const { shoppingList } = this.state
    let windowHeight = Taro.getSystemInfoSync().windowHeight
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
              已派单
            </View>
            <View className='orderParticulars-message'>
              <View className='orderParticulars-message-flex'>
                <Text className='orderParticulars-message-placeholder'>

                </Text>
                <Text className='orderParticulars-message-text'>
                  {shoppingList.shopDomain.adminName} {shoppingList.shopDomain.adminPhone}
                </Text>
              </View>
              <View className='orderParticulars-message-flex'>
                <View>
                  <View className='iconfont icon_shoplocation orderParticulars-message-icon'></View>
                </View>
                <Text>
                  甘肃省兰州市城关区雁南街道雁西路630号雁南街道雁西路630号
                </Text>
              </View>
            </View>
            <View className='orderMessage'>
              <View className='orderMessage-head'>
                <Text className='orderMessage-head-left'>
                  订单信息
                </Text>
                <Text className='orderMessage-head-right'>
                  已派单  5/12
                </Text>
              </View>
              <View className='orderMessage-content'>
                <Text className='orderMessage-content-text'>
                  订单编号：
                </Text>
                <Text className='orderMessage-content-text-color'>
                  620101200119022630001
                </Text>
              </View>
              <View className='orderMessage-content'>
                <Text className='orderMessage-content-text'>
                  订单编号：
                </Text>
                <Text>
                  2019-04-02  23:25:40
                </Text>
              </View>
              <View className='orderMessage-content'>
                <Text className='orderMessage-content-text'>
                  供应商：
                </Text>
                <Text>
                  供应商二
                </Text>
              </View>
            </View>
            {this.renderOrder(shoppingList.subOrderDetailList)}
          </ScrollView>
        </View>
      </View>
    )
  }
}
