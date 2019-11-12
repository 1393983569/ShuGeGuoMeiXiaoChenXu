import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Icon, Image } from '@tarojs/components'
import { selectGoodsDetails, shopFindById } from '../../../../api/purchase/particulars'
import { AtMessage } from 'taro-ui'
import { addCart } from '../../../../api/purchase/orderEdit'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: '',
      shopObj: {},
      status: 0
    }
  }

  config = {
    navigationBarTitleText: '商品详情'
  }

  componentWillMount() {
    this.setState({
      id: this.$router.params.id
    })
  }

  componentDidMount() {
    this.getCommodityDetails()
  }

  // 获取商品详情
  getCommodityDetails() {
    shopFindById(this.state.id, Taro.getStorageSync('adminId').id).then(res => {
      console.log(res)
      this.setState({
        shopObj: {
          goodsDomain: res.info,
          ...res.info,
          goodsStatus: 1
        }
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 加入购物车
  addShop(shopObj) {
    let data = {
      number: shopObj.amount += 1,
      goodsId: shopObj.id,
      adminId: Taro.getStorageSync('adminId').id,
      categoryOneId: shopObj.categoryOneId,
      categoryTwoId: shopObj.categoryTwoId,
      shopId: Taro.getStorageSync('adminId').shopId
    }
    addCart(data).then(res => {
      this.handleMessage('success', '成功')
    }).catch(err => {
      console.log(err)
    })
  }

  // 消息提示
  handleMessage (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  render () {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 5}Px`,
      marginBottom: '25Px'
    }
    const { shopObj } = this.state
    return (
      <View className='box'>
         <AtMessage />
          <ScrollView
          className='scrollview scrollviewHeight'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
        >
        {
          shopObj.goodsDomain ? <View >
          <View className='box-head'>
            <Image
              className='box-imge'
              src={shopObj.goodsDomain.bigImg}
            />
            <View className='box-head-state'>
              已上线
            </View>
          </View>
          <View  className='box-one'>
            <View>
              草莓
            </View>
            <View className='box-one-name'>
              <View>
                采购价：<Text style='color: #FF9800'>￥{Math.floor(shopObj.goodsDomain.purchasePrice) / 100}</Text>
              </View>
            </View>
          </View>
          <View className='box-tow'>
            <View>商品条码：{shopObj.goodsDomain.barCode}</View>
            <View>商品ID：{shopObj.goodsId}</View>
            <View>标签：{shopObj.goodsDomain.tab}</View>
            <View>规格：{shopObj.goodsDomain.standards}</View>
            <View>单位：{shopObj.goodsDomain.unit}</View>
            <View>备注：{shopObj.goodsDomain.remark}</View>
            <View>保质期：{shopObj.goodsDomain.qualityDate}过期</View>
            <View>保鲜期：{shopObj.goodsDomain.freshDate}小时</View>
            <View>状态：{shopObj.goodsDomain.state + '' === '0' ? '有货' : '缺货'}</View>
          </View> </View> : null
        }
        <View className="addCaed">
          <View className="addCaed-button" onClick={() => this.addShop(shopObj)}>
            加入购物车
          </View>
        </View>
        </ScrollView>
      </View>
    )
  }
}
