import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import ZdyButton from '../../component/ZdyButton/index'
import PieChart from '../../component/echartsComponents/pieChart'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pieChart: []
    }
  }

  config= {
    navigationBarTitleText:'会员详情'
  }

  componentDidMount() {
    const chartData = [
      {value:335, name:'水果'},
      {value:310, name:'肉'},
      {value:234, name:'蔬菜'},
      {value:135, name:'熟食'},
      {value:1548, name:'调料'}
    ]
    this.pieChart.refresh(chartData)
  }

  refPieChart = (node) => this.pieChart = node

  onClickLook() {

  }

  // 滑动到底部
  onScrollToLower() {

  }



  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight}Px`
    }
    return (
      <View className='box-particulars'>
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
          <View className='conten'>
            <View className='box-particulars-message-border'>
              <View className='box-particulars-message-left'>
                <Image
                  style='width: 80Px;height: 80Px;background: #fff;'
                  src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
                />
              </View>
              <View className='box-particulars-message-right'>
                <View className='box-particulars-message-right-id'>
                  会员ID：620102100001
                </View>
                <View className='box-particulars-message-right-number'>
                  手机号：15002647894
                </View>
              </View>
            </View>
            <View className='box-particulars-register'>
              <View className='box-particulars-register-left'>
                注册店铺：天水路店
              </View>
              <View style='color: #8BC34A'>|</View>
              <View className='box-particulars-register-right'>
                <View>积分：3000</View>
                <View className='box-particulars-register-right-left'>
                  <ZdyButton name='查看' color='#8BC34A' borderColor='#8BC34A' onClickButton={this.onClickLook}/>
                </View>
              </View>
            </View>
            <View className='box-particulars-userMessage'>
              <View>
                性别：男
              </View>
              <View>
                年龄：31
              </View>
              <View>
                职业：初中教师
              </View>
              <View>
                常住小区：甘肃省兰州市城关区雁南街道222号
              </View>
            </View>
            <View className='box-particulars-vip'>
              会员级别：银牌会员
            </View>
            <View className='box-particulars-analyze'>
              <View className='box-particulars-analyze-name'>
                会员分析:
                <View className='box-particulars-analyze-name-conten'>
                  <View className='box-particulars-analyze-name-conten-text'>
                    <View className='box-particulars-analyze-name-conten-segmentation'></View>
                    <View className='box-particulars-analyze-name-conten-text-sl'>平均购买力：</View>
                    <View className='box-particulars-analyze-name-conten-text-number'>50.00</View>
                  </View>
                </View>
                <View className='box-particulars-analyze-name-conten'>
                  <View className='box-particulars-analyze-name-conten-text'>
                    <View className='box-particulars-analyze-name-conten-segmentation'></View>
                    <View className='box-particulars-analyze-name-conten-text-sl'>平均购买力：</View>
                    <View className='box-particulars-analyze-name-conten-text-number'>50.00</View>
                  </View>
                </View>
                <View className='box-particulars-analyze-name-conten'>
                  <View className='box-particulars-analyze-name-conten-text'>
                    <View className='box-particulars-analyze-name-conten-segmentation'></View>
                    <View className='box-particulars-analyze-name-conten-text-sl'>平均购买力：</View>
                    <View className='box-particulars-analyze-name-conten-text-number'>50.00</View>
                  </View>
                </View>
                <View className='box-particulars-analyze-name-conten'>
                  <View className='box-particulars-analyze-name-conten-text'>
                    <View className='box-particulars-analyze-name-conten-segmentation'></View>
                    <View className='box-particulars-analyze-name-conten-text-sl'>复购品类：</View>
                    <View className='box-particulars-analyze-name-conten-text-number'>50.00</View>
                  </View>
                </View>
              </View>
              <View className='box-particulars-pie-chart'>
                <PieChart ref={this.refPieChart}/>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
