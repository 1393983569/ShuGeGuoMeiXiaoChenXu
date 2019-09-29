import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import Loading from '../../component/loading/loading'
import { queryMember } from '../../api/member/memberList'
import './index.scss'

export default class Index extends Component {

  constructor () {
    this.state = {
      dataList: [],
      pageNum: 1,
      load: '',
      loadingState: false
    }
  }

  config = {
    navigationBarTitleText:'会员列表'
  }

  componentDidMount() {
    this.getList()
  }

  // 获取数据
  getList() {
    if (this.state.loadingState) return
    this.setState({load: 'loading'})
    const { pageNum, dataList } = this.state
    queryMember(pageNum).then(res => {
      if (res.info.records.length === 0) {
        this.setState({
          load: 'on',
          loadingState: true
        })
        return
      }
      let quDataList = dataList
      res.info.records.forEach(item => {
        try{
          quDataList.push(
            {
              // 余额
              balance: item.balance,
              // 头像
              avatar: item.avatar,
              // 会员等级 1普通会员2银牌会员3金牌会员4钻石会员
              level: this.getMemberLevel(item.level),
              // 身份（1 家庭会员，2 VIP用户）
              identity: item.identity === 1 ? '家庭会员' : 'VIP用户' ,
              id: item.id,
              mobile: item.mobile
            }
          )
        } catch(err) {
          console.log(err)
        }
      })
      this.setState({
        dataList: quDataList,
        load: 'unfinished'
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 分页
  onScrollToLower() {
    let pageNum = this.state.pageNum
    pageNum++
    this.setState({
      pageNum
    }, () => {
      this.getList()
    })
  }

  // 筛选会员等级
  getMemberLevel(level) {
    let name = null
    switch(level) {
      case 1:
        name = '普通会员'
        break
      case 2:
        name = '银牌会员'
        break
      case 3:
        name = '金牌会员'
        break
      case 4:
        name = '钻石会员'
        break
      default:
      break
    }
    return name
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight}Px`
    }
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
          onScrollToLower={this.onScrollToLower}
        >
        {
          this.state.dataList.map((item, index) => {
            return <View className='conten' key={index + '_n'}>
            <View className='box-head'>
              <View className='box-head-left'>
                <View>
                  <Image
                  style='width: 40Px;height: 40Px;border-radius: 4Px;'
                  src={ item.avatar }/>
                </View>
                <View>
                  {
                    item.mobile
                  }
                </View>
              </View>
              <View className='box-head-right'>
                <Text>
                  {
                    item.identity
                  }
                </Text>
                <View className='iconfont icon_home_marketingcenter_rightarrow box-head-right-icon'></View>
              </View>
            </View>
            <View className='box-bottom'>
              <View className='box-bottom-button-left'>
                {
                  item.level
                }
              </View>
              <View style='color: #8BC34A;'>|</View>
              <View className='box-bottom-button-right'>
                余额：{ parseInt(item.balance) * 0.01 }
              </View>
            </View>
          </View>
          })
        }
        <Loading load={this.state.load} />
      </ScrollView>
      </View>
    )
  }
}
