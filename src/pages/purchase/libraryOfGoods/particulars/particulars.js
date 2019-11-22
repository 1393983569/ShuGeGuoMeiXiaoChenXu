import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Icon, Image } from '@tarojs/components'
import { selectGoodsDetails, shopFindById } from '../../../../api/purchase/particulars'
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
    selectGoodsDetails(this.state.id).then(res => {
      console.log(res)
      this.setState({
        shopObj: res.info
      })
    }).catch(err => {
      console.log(err)
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
            {
              shopObj.goodsDomain.isShelf ? '已上线' : '已下线'
            }
            </View>
          </View>
          <View  className='box-one'>
            <View>
              {
                shopObj.goodsName
              }
            </View>
            <View className='box-one-name'>
              <View>
                采购价：<Text style='color: #FF9800'>￥{Math.floor(shopObj.goodsDomain.sellPrice) / 100}</Text>
              </View>
              <View>
                零售价：<Text style='color: #FF9800'>￥{Math.floor(shopObj.goodsDomain.price) / 100}</Text>
              </View>
              <View>
                折扣率：<Text style='color: #FF9800'>{shopObj.rate ? shopObj.rate + '%' : '暂无'}</Text>
              </View>
              <View>
                折扣价：<Text style='color: #FF9800'>￥{Math.floor(shopObj.goodsDomain.price * (shopObj.rate ? shopObj.rate / 100 : 1)) / 100 }</Text>
              </View>
            </View>
          </View>
          <View className='box-tow'>
            <View>品类：{shopObj.categoryOneName}-{shopObj.categoryTwoName}</View>
            <View>商品条码：{shopObj.barCode ? shopObj.barCode : '暂无' }</View>
            <View>商品ID：{shopObj.goodsId}</View>
            <View>规格：{shopObj.goodsDomain.standards}</View>
            <View>单位：{shopObj.goodsDomain.unit}</View>
            <View>标签：{shopObj.goodsDomain.tab}</View>
          </View>
          <View className='box-tow'>
            <View>
              人工损耗（斤）：{ shopObj.recordDomain && Math.abs(shopObj.recordDomain.artificial) ? Math.abs(shopObj.recordDomain.artificial) : '暂无' }
            </View>
            <View>
              自然损耗（斤）：{ shopObj.recordDomain && Math.abs(shopObj.recordDomain.natural) ? Math.abs(shopObj.recordDomain.natural) : '暂无' }
            </View>
          </View>
          <View className='box-tow'>
            <View>
              保质期预警：{ shopObj.goodsDomain.qualityDate || '暂无' }
            </View>
            <View>
              保鲜期预警：{ shopObj.goodsDomain.freshDate || '暂无' }
            </View>
          </View>
          <View className='box-tow' style='height: 30Px;line-height: 30Px;'>
            产地：{ shopObj.goodsDomain.countryId === 999999 ? '国外' : `${shopObj.goodsDomain.province.name}-${shopObj.goodsDomain.city.name}-${shopObj.goodsDomain.area.name}`}
          </View>
          <View className='box-tow'  style='height: 30Px;line-height: 30Px;'>
            电脑库存（斤）：{ shopObj.computerStock }
          </View>
          <View className='box-tow'  style='height: 30Px;line-height: 30Px;'>
            备注：{ shopObj.goodsDomain.remark ? shopObj.goodsDomain.remark : '暂无' }
          </View>
          <View>
            <Button className='btn-max-w box-button' plain >下线</Button>
          </View>
        </View> : null
        }
        </ScrollView>
      </View>
    )
  }
}
