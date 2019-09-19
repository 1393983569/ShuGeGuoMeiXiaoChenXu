import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

export default class DoBusiness extends Component {
  constructor (props) {
    super(props)

  }

  render () {
    return (
      <View>
        <View className='box'>
          <View className='head'>
            营业概况
          </View>
          <View className='content'>
            <View className='content-text'>
              <View>
                实收金额：+3000.00元
              </View>
              <View>
                比昨天：+300.00元
              </View>
            </View>
            <View className='content-text'>
              <View>
                总单量：400.00单
              </View>
              <View>
                单均价：100.00元/单
              </View>
            </View>
            <View className='content-text'>
              <View>
              进店会员：300人
              </View>
              <View>
              进店非会员：50人
              </View>
            </View>
          </View>
        </View>
        <View style={{marginTop: '10Px'}}>
        <View className='box'>
          <View className='head'>
          经营数据
          </View>
          <View className='content'>
            <View className='content-text'>
              <View>
              销售额：4000.00元
              </View>
              <View>
              收银损耗：100.00元
              </View>
            </View>
            <View className='content-text'>
              <View>
              实际销售额：3900.00元
              </View>
              <View>
              实收总额：3000元
              </View>
            </View>
            <View className='content-text'>
              <View>
              订单数：400单
              </View>
              <View>
              人均消费：40.00元/人
              </View>
            </View>
          </View>
        </View>
        </View>
      </View>
    )
  }

}
