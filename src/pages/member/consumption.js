import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { selectOrderDetail } from '../../api/member/consumption'
import './index.scss'

export default class Consumption extends Component {

  constructor(props) {
    super(props)
    this.state = {
      memberId: '',
      pageNum: 1,
      data: {}
    }
  }

  componentDidMount() {
    this.getList()
  }

  // 获取数据
  getList() {
    selectOrderDetail(this.$router.params.orderId, this.state.pageNum).then(res => {
      console.log(res)
      const data = {}
      data.orderNo = res.info[0].orderNo
      data.orderNo = res.info[0].createTime
      data.list = res.info[0].orderDetailList.map(item => {
        return {
          goodsName: item.goodsName,
          id: item.id,
          unit: item.unit,
          standards: item.standards,
          money: item.money,
          price: item.price
        }
      })
      this.setState({
        data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 滑动到底部
  onScrollToLower() {
    console.log('ssssssssssssssssssssssss')
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    let { data } = this.state
    const scrollStyle = {
      height: `${windowHeight - 5}Px`
    }
    return(
      <View className='consumption-box'>
       <ScrollView
          className='scrollview scrollviewHeight'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToLower={this.onScrollToLower}
          >
          <View className='consumption-box-outer'>
            <View className='consumption-box-head'>
              <View className='consumption-box-head-xx'>
                订单信息
              </View>
              <View className='consumption-box-head-bh'>
                <Text style="color: #979797;">订单编号:</Text>
                { data.orderNo }
              </View>
              <View className='consumption-box-head-xf'>
                <Text style="color: #979797;">消费时间:</Text>
                { data.createTime }
              </View>
            </View>
            <View className='consumption-box-content'>
              <View className='consumption-box-content-head'>
                <View className='consumption-box-content-head-left'>
                  订单明细：
                </View>
                <View className='consumption-box-content-head-right'>
                  <Text style="color: #666;">收银员：</Text>
                </View>
              </View>
              <View>
                <View className="tr" style='background-color: #E7F2DA;'>
                  <View className="th">商品名称</View>
                  <View className="th">商品ID</View>
                  <View className="th">单位</View>
                  <View className="th">单价</View>
                  <View className="th">折扣</View>
                  <View className="th">数量</View>
                  <View className="th">金额</View>
                </View>
                {
                  data.list.map(listItem => {
                    return <View className="tr" key={listItem.id}>
                      <View className="td">{listItem.goodsName}</View>
                      <View className="td">{listItem.id}</View>
                      <View className="td">{listItem.unit}</View>
                      <View className="td">{listItem.price}</View>
                      <View className="td"> 折扣字段待定 </View>
                      <View className="td">{listItem.detailAmount}</View>
                      <View className="td">{listItem.money}</View>
                    </View>
                  })
                }
              </View>
              <View className='consumption-box-float'>
                <View className='consumption-box-float-left'>
                合计：
                </View>
                <View className='consumption-box-float-right'>
                ￥50.00
                </View>
              </View>
              <View className='consumption-box-float' style='border-top: 1Px solid #f1f1f1;'>
                <View className='consumption-box-float-left'>
                折扣终价（-3）：
                </View>
                <View className='consumption-box-float-right'>
                ￥57.00
                </View>
              </View>
              <View className='consumption-box-remake' style='border-top: 1Px solid #f1f1f1;'>
                备注：无
              </View>
              <View className='consumption-box-float' style='border-top: 1Px solid #f1f1f1;'>
                <View className='consumption-box-float-left'>
                结单（去零）：
                </View>
                <View className='consumption-box-float-right'>
                ￥50.00
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}
