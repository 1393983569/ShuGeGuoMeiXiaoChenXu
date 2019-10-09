import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import ZdyButton from '../../component/ZdyButton/index'
import Loading from '../../component/loading/loading'
import PieChart from '../../component/echartsComponents/pieChart'
import { selectOrderDetail, findMember } from '../../api/member/memberParticulars'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pieChart: [],
      load: '',
      pageNum: 1,
      loadStatus: true,
      consumptionList: [],
      memberData: {}
    }
  }

  config= {
    navigationBarTitleText:'会员详情'
  }

  componentDidMount() {
    this.getList()
    this.getMemberMessage()
  }

  refPieChart = (node) => this.pieChart = node

  // 加载饼状图
  loatPie() {
    const chartData = this.state.memberData.categoryOneAmount.map(item => {
      return {
        value: item.category,
        name: item.categoryName
      }
    })
    this.pieChart.refresh(chartData)
  }

  // 获取消费记录
  getList() {
    const memberId = this.$router.params.memberId
    selectOrderDetail(memberId, this.state.pageNum).then(res => {
      if (res.info.records.length !== 0) {
        const consumptionList = JSON.parse(JSON.stringify(this.state.consumptionList))
        res.info.records.forEach(item => {
          consumptionList.push({
            orderNo: item.orderNo,
            totalMoney: parseInt(item.payMoney) * 0.01,
            createTime: item.createTime,
            shopName: item.shopName || '暂无',
            id: item.id
          })
        })
        this.setState({
          loadStatus: true,
          consumptionList,
          load: 'unfinished'
        })
      } else {
        this.setState({
          loadStatus: false,
          load: 'on'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  // 获取会员信息
  getMemberMessage() {
    findMember(110101100001).then(res => {
      const { info }  = res
      const data = {
        mobile: info.mobile,
        id: info.id,
        shopName: info.shopName,
        score: info.score || 0 ,
        balance: info.balance,
        identityName: info.identity + '' === '1' ? '家庭会员' : 'VIP会员',
        identity: info.identity,
        sex: info.sex,
        age: info.age || '暂无',
        career: info.career || '暂无',
        site: info.provinceDomain.name + info.cityDomain.name + info.areaDomain.name,
        maxPayMoney: parseInt(info.maxPayMoney) * 0.01,
        minPayMoney: parseInt(info.minPayMoney) * 0.01,
        monthAmount: info.monthAmount,
        avgPayMoney: info.avgPayMoney,
        weekAmount: info.weekAmount,
        categoryOneAmount: info.categoryOneAmount
      }
      this.setState({
        memberData: data
      }, () => {
        this.loatPie()
      })
    }).catch(err => {
      console.log(err)
    })
  }

  onClickLook(memberId) {
    Taro.navigateTo({
      url: '/pages/member/integral?memberId=' + memberId
    })
  }

  // 滑动到底部
  onScrollToLower() {
    console.log('消费记录加载')
    if (!this.state.loadStatus) return
    let pageValue = this.state.pageNum
    pageValue++
    this.setState({
      pageNum: pageValue,
      load: 'loading'
    }, () => {
      this.getList()
    })
  }

  // 跳转充值记录
  toUpRecord(memberId) {
    Taro.navigateTo({
      url: '/pages/member/charge?memberId=' + memberId
    })
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 5}Px`
    }
    const { consumptionList } = this.state
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
                  会员ID：{ this.state.memberData.id }
                </View>
                <View className='box-particulars-message-right-number'>
                  手机号：{ this.state.memberData.mobile }
                </View>
              </View>
            </View>
          </View>
          <View className='conten'>
            <View className='record-message-border'>
              <View className='box-particulars-register'>
                <View className='box-particulars-register-left'>
                  注册店铺：{ this.state.memberData.shopName }
                </View>
                <View style='color: #8BC34A'>|</View>
                <View className='box-particulars-register-right'>
                  <View>积分：{ this.state.memberData.score }</View>
                  <View className='box-particulars-register-right-left'>
                    <ZdyButton name='查看' color='#8BC34A' borderColor='#8BC34A' onClickButton={() => this.onClickLook(this.state.memberData.id)}/>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='conten'>
            <View className='record-message-border'>
              <View className='balance'>
                <View className='balance-left'>
                  余额：{ this.state.memberData.shopName }
                </View>
                <View className='balance-right' onClick={() => this.toUpRecord(this.state.memberData.id)}>
                  <View style='color: #999999;'>充值记录</View>
                  <View className='box-particulars-register-right-left'>
                    <View className='iconfont icon_home_marketingcenter_rightarrow box-head-right-icon' style='color: #999999;'></View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className='conten'>
            <View className='record-message-border'>
              <View className='box-particulars-vip'>
                会员级别：银牌会员
              </View>
            </View>
          </View>
          <View className='conten'>
            <View className='record-message-border'>
              <View className='box-particulars-userMessage'>
                <View>
                  性别：{ this.state.memberData.sex }
                </View>
                <View>
                  年龄：{ this.state.memberData.age }
                </View>
                <View>
                  职业：{ this.state.memberData.career }
                </View>
                <View>
                  常住小区：{ this.state.memberData.site }
                </View>
              </View>
            </View>
          </View>
          <View className='conten'>
            <View className='record-message-border'>
              <View className='box-particulars-analyze'>
                <View className='box-particulars-analyze-name'>
                  会员分析:
                  <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>平均购买力：</View>
                      <View className='box-particulars-analyze-name-conten-text-number'>{ this.state.memberData.site }</View>
                    </View>
                  </View>
                  <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>最高订单额：</View>
                      <View className='box-particulars-analyze-name-conten-text-number'>{ this.state.memberData.maxPayMoney }</View>
                    </View>
                  </View>
                  <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>最低订单额：</View>
                      <View className='box-particulars-analyze-name-conten-text-number'>{ this.state.memberData.minPayMoney }</View>
                    </View>
                  </View>
                  <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>复购品类：</View>
                    </View>
                  </View>
                </View>
                <View className='box-particulars-pie-chart'>
                  <PieChart ref={this.refPieChart}/>
                </View>
                <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>每周进店次数：</View>
                      <View className='box-particulars-analyze-name-conten-text-number'>{ this.state.memberData.weekAmount }</View>
                    </View>
                </View>
                <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>每日进店次数：</View>
                      <View className='box-particulars-analyze-name-conten-text-number'>{ this.state.memberData.monthAmount }</View>
                    </View>
                </View>
                <View className='box-particulars-analyze-name-conten'>
                    <View className='box-particulars-analyze-name-conten-text'>
                      <View className='box-particulars-analyze-name-conten-segmentation'></View>
                      <View className='box-particulars-analyze-name-conten-text-sl'>用户关系：</View>
                      <View className='box-particulars-analyze-name-conten-text-number'></View>
                    </View>
                </View>
              </View>
            </View>
          </View>
          <View className='conten'>
            <View className='record-message-border'>
              <View className='consumption-record'>
                消费记录:
              </View>
              {
                consumptionList.map(item => {
                  return <View className='consumption-record-content' key={item.id}>
                    <View className='consumption-record-content-item'>
                      { item.createTime }
                    </View>
                    <View className='consumption-record-content-order'>
                      <View className='consumption-record-content-order-left'>
                        订单号：{ item.orderNo }
                      </View>
                      <View className='consumption-record-content-order-right'>
                        <View className='iconfont icon_home_marketingcenter_rightarrow box-head-right-icon'></View>
                      </View>
                    </View>
                    <View className='consumption-record-content-shop'>
                      <View className='consumption-record-content-shop-left'>
                        { item.shopName }
                      </View>
                      <View className='consumption-record-content-shop-right'>
                        { item.totalMoney }
                      </View>
                    </View>
                  </View>
                })
              }
              <Loading load={this.state.load}/>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
