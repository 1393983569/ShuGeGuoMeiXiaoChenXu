import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { queryNoPageOrder } from '../../../api/purchase/hasBeenOpened'
import { connect } from '@tarojs/redux'
import { setOrderState } from '../../../actions/counter'
import '../../../fonts/iconfont.css'
import './index.scss'

// 获取redux
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  setOrderState (state) {
    dispatch(setOrderState(state))
  }
}))

export default class Index extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dataList: []
    }
  }

  componentDidMount () {
    this.getList()
  }

  // 获取数据
  getList() {
    queryNoPageOrder(1, Taro.getStorageSync('adminId').shopId, Taro.getStorageSync('orderItem'), Taro.getStorageSync('orderName')).then(res => {
      const list = res.info.map(item => {
        return {
          id: item.id,
          orderNo: item.orderNo,
          orderDetails: item.orderDetails,
          totalMoney: item.totalMoney
        }
      })
      this.setState({
        dataList: list
      })
    }).catch(err => {

    })
  }

  // 跳转详情
  goParticulars(orderId, e) {
    this.props.setOrderState('已拆单')
    Taro.navigateTo({
      url: '/pages/purchase/orderForm/orderParticulars?orderId=' + orderId + '&state="已拆单"'
    })
  }

  render() {
    return(
      <View>
        {
          this.state.dataList.map((item, index) => {
            return(
              <View className='didNotOpen' key={index + 'f'}>
                <View className='didNotOpen-head' onClick={this.goParticulars.bind(this, item.orderNo)}>
                  <Text>
                    订单号：{item.orderNo}
                  </Text>
                  <View className='iconfont icon_rightarrow didNotOpen-head-icon'></View>
                </View>
                <View className='didNotOpen-content'>
                  {
                    item.orderDetails.map((_item, _index) => {
                      return(
                        <View className='didNotOpen-content-text' key={_index + 'g'}>
                          {_item.name} x {_item.categoryCount}
                        </View>
                      )
                    })
                  }
                </View>
                <View className='didNotOpen-sum'>
                  <Text className='didNotOpen-sum-left'>
                    合计
                  </Text>
                  <Text className='didNotOpen-sum-right'>
                    ￥{item.totalMoney}
                  </Text>
                </View>
                <View className='didNotOpen-button'>
                  <View className='didNotOpen-button-box'>
                    <Button size='mini' disabled className='didNotOpen-button-b'>已拆单</Button>
                  </View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
