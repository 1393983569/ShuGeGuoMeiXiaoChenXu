import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { queryNoPageIntegral } from '../../api/member/integral'
import Loading from '../../component/loading/loading'
import './index.scss'

export default class Integral extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      pageNum: 1,
      queryStatus: true,
      load: ''
    }
  }

  config = {
    navigationBarTitleText: '积分变动记录'
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    queryNoPageIntegral(this.$router.params.memberId).then(res => {
      const list = JSON.parse(JSON.stringify(this.state.dataList))
      if (res.info.records.length !== 0) {
        res.info.records.forEach(item => {
          list.push({
            ...item
          })
        })
        this.setState({
          dataList: list,
          queryStatus: true
        })
      } else {
        this.setState({
          queryStatus: false,
          load: 'on'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  onScrollToLower() {
    console.log('加载数据')
    if (!this.state.queryStatus) return
    let pageNum = this.state.pageNum
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
    let { dataList } = this.state
    const scrollStyle = {
      height: `${windowHeight - 5}Px`
    }
    return(
      <View className='integral-box'>
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
            <View className='integral-box-content'>
              {
                dataList.map(item => {
                  return <View className='integral-box-content-list' key={item.id}>
                    <View className='integral-box-content-list-time'>
                      { item.changeTime }
                    </View>
                    <View className='integral-box-content-list-integral'>
                      <View className='integral-box-content-list-integral-left'>
                        { item.changeItem }
                      </View>
                      <View className='integral-box-content-list-integral-right'>
                        积分值：{ item.integral }
                      </View>
                    </View>
                  </View>
                })
              }
            </View>
          </ScrollView>
          <Loading load={this.state.load}/>
      </View>
    )
  }
}
