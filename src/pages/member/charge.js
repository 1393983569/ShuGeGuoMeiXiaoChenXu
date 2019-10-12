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
      load: '',
      dataList: []
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
      if (res.info.records.length !== 0) {
        const dataList = JSON.parse(JSON.stringify(this.state.dataList))
        res.info.records.forEach(item => {
          dataList.push({
            ...item,
            money: parseInt(item.money) * 0.01
          })
        })
        this.setState({
          dataList,
          queryListStatus: true,
          load: 'jazz'
        })
      } else {
        this.setState({
          queryListStatus: false,
          load: 'on'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  // 滚动加载
  onScrollToLower() {
    if (!this.state.queryListStatus) return
    pageNum++
    this.setState({
      pageNum,
      load: 'loading'
    }, () => {
      this.getList()
    })
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 5}Px`
    }
    const { dataList } = this.state
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
        {
          dataList.map(item => {
            return <View style='padding: 10Px 14Px;' key={ item.id + '_c' }>
              <View className='box-charge-content'>
                <View className='box-charge-content-top'>
                  { item.rechargeTime }
                </View>
                <View className='box-charge-content-bottom'>
                  充值：￥{ item.money }
                </View>
              </View>
            </View>
          })
        }
        </ScrollView>
        <Loading load={this.state.load}/>
      </View>
    )
  }
}
