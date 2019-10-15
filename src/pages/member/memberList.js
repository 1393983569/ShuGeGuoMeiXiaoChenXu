import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import Loading from '../../component/loading/loading'
import { queryMember } from '../../api/member/memberList'
import './index.scss'

export default class Index extends Component {

  constructor (props) {
    super(props)
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
      let quDataList = JSON.parse(JSON.stringify(dataList))
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
      console.log(quDataList)
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

  // 跳转会员详情
  redirect(memberId) {
    Taro.navigateTo({
      url: '/pages/member/memberParticulars?memberId=' + memberId
    })
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    const { dataList } = this.state
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
          dataList.map((item, index) => {
            return (
              <View className='conten' key={index + '_n'}>
                <View className='box-head'>
                  <View className='box-head-left'>
                    <View>
                      <Image
                      // src={ item.avatar }
                      style='width: 40Px;height: 40Px;border-radius: 4Px;'
                      src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
                      />
                    </View>
                    <View>
                      {
                        item.mobile
                      }
                    </View>
                  </View>
                  <View className='box-head-right' onClick={() => this.redirect(item.id)}>
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
                    余额：{ item.balance !== null ? parseInt(item.balance) * 0.01 : 0 }
                  </View>
                </View>
              </View>
            )
          })
        }
        <Loading load={this.state.load} />
      </ScrollView>
      </View>
    )
  }
}
