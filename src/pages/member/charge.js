import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { selectPage } from '../../api/member/charge'
import Loading from '../../component/loading/loading'
import './index.scss'

export default class Charge extends Component {

  constructor(props) {
    super(props)
    this.state ={
      pageNum: 1,
      queryListStatus: true,
      load: ''
    }
  }

  config = {
    navigationBarTitleText: '充值记录'
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    selectPage(this.$router.params.memberId, this.state.pageNum).then(res => {

    }).catch(err => {

    })
  }

  // 滚动加载
  onScrollToLower() {
    if (!this.state.queryListStatus) return
    pageNum++
    this.getList()
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 5}Px`
    }
    return (
      <View className='box-charge'>
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
          <View style='padding: 10Px 14Px;'>
            <View className='box-charge-content'>
              <View className='box-charge-content-top'>
                2019-03-25  07：30
              </View>
              <View className='box-charge-content-bottom'>
                充值：￥30.00
              </View>
            </View>
          </View>
        </ScrollView>
        <Loading load={this.state.load}/>
      </View>
    )
  }
}
