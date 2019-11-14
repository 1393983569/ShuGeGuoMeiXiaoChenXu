import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import BottomBar from '../../../component/bottomBar/bottomBar'
import { selectPageCart, updateAmount } from '../../../api/purchase/orderEdit'
import { connect } from '@tarojs/redux'
import { setOrderState } from '../../../actions/counter'
import ZdyButton from '../../../component/ZdyButton/index'
import './orderEdit.scss'

// 获取redux
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  setOrderState (state) {
    dispatch(setOrderState(state))
  }
}))
export default class Index extends Component{
  constructor (props) {
    super(props)
    this.state = {
      suborderNo: '',
      orderList: [],
      orderNo: '',
      screenHeight: 0
    }
  }

  config = {
    navigationBarTitleText: '订单编辑'
  }

  componentDidMount () {
    Taro.getSystemInfo({})
    .then(res  => {
      console.log(res)
      this.setState({
        screenHeight: res.screenHeight
      })
     })
    this.getList()
  }

  componentWillMount() {
    this.setState({
      suborderNo: this.$router.params.orderId
    })
  }

  getList() {
    selectPageCart(this.state.suborderNo).then(res => {
      this.setState({
        orderList: this.toDistinguishTheCategory(res.info.orderDetails),
        orderNo: res.info.orderNo
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 区分品类
  toDistinguishTheCategory(list) {
    const data = {}
    const _list = []
    list.forEach(item => {
      if (data[item.categoryOneName]) {
        data[item.categoryOneName].list.push(item)
      } else {
        data[item.categoryOneName] = {}
        data[item.categoryOneName].name = item.categoryOneName
        data[item.categoryOneName].list = []
        data[item.categoryOneName].list.push(item)
      }
    })
    for (const key in data) {
      _list.push(data[key])
    }
    return _list
  }

  // 计算小计金额
  subtotalAmount(list) {
    let sumPrice = 0
    list.forEach(item => {
      sumPrice += Math.floor(parseInt(item.price * item.amount)) / 100
    })
    return sumPrice
  }

   // 计算总金额
   aggregateAmount(list) {
    let sumPrice = 0
    list.forEach(item => {
      item.list.forEach(_item => {
        sumPrice += Math.floor(parseInt(_item.price * _item.amount)) / 100
      })
    })
    return sumPrice
  }

  // 修改数量
  editQuantity(e, fIndex, index) {
    const orderList = this.state.orderList
    orderList[fIndex].list[index].amount = e.detail.value
    this.setState({
      orderList
    })
  }

  // 保存修改后的数量
  onClickAdd() {
    console.log(this.state.orderList)
    const orderList = this.state.orderList
    const list = []
    orderList.forEach(item => {
      item.list.forEach(_item => {
        list.push({
          ..._item
        })
      })
    })
    updateAmount(list).then(res => {
      Taro.navigateTo({
        url: '/pages/purchase/orderForm/orderForm'
      })
    }).catch(err => {
      console.log(err)
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
    const { orderNo, orderList, screenHeight } = this.state
    return (
      <View className='box'>
        <AtMessage />
        <View className='box-order'>
          订单号：{ orderNo }
        </View>
        <View className='slide' style={`height: ${screenHeight - 100}px`}>
          {
            orderList.map((item, _index) => {
              return <View className='box-content' key={item.name}>
                <View>
                  {item.name}
                </View>

                <View className='box-list'>
                  <View className='box-list-box'>
                  {
                    item.list.map((items, index) => {
                      return <View className='box-list-content' key={items.goodsName + items.index}>
                        <Image src={items.bigImg} className='box-list-content-img'></Image>
                        <View className='box-list-content-text'>
                          <View className='box-list-content-text-head'>{ items.goodsName }</View>
                          <View className='box-list-content-text-content'>
                            <View className='box-list-content-text-content-text'>
                            规格：{ items.standards }
                            </View>
                            <View className='box-list-content-text-content-text'>
                            单位：{ items.unit }
                            </View>
                          </View>
                          <View className='box-list-content-text-price'>
                            <View className='box-list-content-text-price-left'>¥{ Math.floor(items.price) / 100 }</View>
                            <View className='box-list-content-text-price-right'>
                              数量: <Input value={items.amount} onBlur={(e) => this.editQuantity(e, _index, index)} className='box-list-content-text-price-right-input' type='number' placeholder='数量'/>
                            </View>
                          </View>
                        </View>
                      </View>
                    })
                  }
                  <View className='box-list-subtotal'>
                    <View>小计金额</View>
                    <View>￥{ this.subtotalAmount(item.list) }</View>
                  </View>
                  </View>
                </View>
              </View>
            })
          }
          <View style="height: 150px"></View>
        </View>
        <View className="box-bottom">
          <View className="box-bottom-content">
            合计：￥{this.aggregateAmount(orderList)} <View className="box-bottom-add" onClick={() => this.onClickAdd()}>保存</View>
          </View>
        </View>
      </View>
    )
  }
}
