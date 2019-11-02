import Taro, { Component, render } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import CircleDateSelect from '../../component/circleDateSelect/circleDateSelect'
import { selectProfitLoss } from '../../api/profitAndLoss/profitAndLossList'
import Loading from '../../component/loading/loading'
import ZdyButtonWidth from '../../component/ZdyButtonWidth/index'
import './profitAndLossList.scss'

export default class ProfitAndLossList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      yearData: '',
      load: ''
    }
  }

  config = {
    navigationBarTitleText: '盈亏数据'
  }

  componentDidMount() {
    this.getList()
  }

  // 加载状态
  loadingState() {
    this.setState({
      load: 'loading'
    })
  }

  // 无数据状态
  onState() {
    this.setState({
      load: 'on'
    })
  }

  // 获取数据
  getList() {
    this.loadingState()
    selectProfitLoss(this.state.yearData).then(res => {
      const list = []
      if (res.info.length !== 0) {
        res.info.forEach(item => {
          list.push({
            ...item,
            unfold: false,
          })
        })
        this.onState()
      } else {
        this.onState()
      }
      this.setState({
        dataList: list
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 获取时间
  getSelectValue(e) {
    console.log(e)
    this.setState({
      yearData: e
    }, () => {
      this.getList()
    })
  }

  // 点击展开
  clickUnfold(index) {
    const data = this.state.dataList
    data[index].unfold = !data[index].unfold
    this.setState({
      dataList: data
    })
  }

  // 金额格式化
  moneyFormatting(money) {
    return Math.floor(money) / 100
  }

  // 新建
  newSub() {
    Taro.navigateTo({
      url: '/pages/profitAndLoss/profitAndLossAdd'
    })
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 130}Px`
    }
    const { dataList } = this.state
    return <View className='profitAndLossList-box'>
        <View>
          <CircleDateSelect showMonthProps={false} showDayProps={false} getSelectValue={this.getSelectValue.bind(this)}/>
        </View>
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
            dataList.map((item, index) => {
              return <View className='profitAndLossList-box-content' key={item.id}>
              <View className='profitAndLossList-box-content-head'>
                <View className='profitAndLossList-box-content-head-left'>
                  { item.createTime.split(' ')[0] }
                </View>
                <View className='profitAndLossList-box-content-head-right' onClick={() => this.clickUnfold(index)}>
                  总成本 = { this.moneyFormatting(item.totalCost) }元
                  {
                    item.unfold ?
                    <View className='iconfont icon_uparrow profitAndLossList-box-content-head-right-icon'></View>:
                    <View className='iconfont icon_downarrow profitAndLossList-box-content-head-right-icon'></View>
                  }
                </View>
              </View>
                {
                  item.unfold ? <View>
                    <View className='profitAndLossList-box-content-gd'>
                      <View className='profitAndLossList-box-content-gd-head'>
                        <View>固定成本</View>
                        <View className='profitAndLossList-box-content-gd-solid'></View>
                      </View>
                      <View>房租（元）：{ this.moneyFormatting(item.rent) }</View>
                      <View>工资支出（元）：{ this.moneyFormatting(item.wages) }</View>
                      <View>水电暖合计（元）：{ this.moneyFormatting(item.hydropower) }</View>
                      <View>其它固定费用总计（元）：{ this.moneyFormatting(item.otherExpenses) }</View>
                    </View>
                    <View className='profitAndLossList-box-content-kb'>
                      <View className='profitAndLossList-box-content-kb-head'>
                        <View>可变成本</View>
                        <View className='profitAndLossList-box-content-kb-solid'></View>
                      </View>
                      <View>营销费用（元）：{ this.moneyFormatting(item.marketing) }</View>
                      <View>其它可变费用总计（元）：{ this.moneyFormatting(item.otherVariables) }</View>
                    </View>
                  </View> : ''
                }
              </View>
            })
          }
          <Loading load={this.state.load}/>
        </ScrollView>
        <View className='profitAndLossList-box-button'>
          <ZdyButtonWidth name='新建' color='#fff' backgroundColor='#8BC34A' onClickButton={() => this.newSub()}/>
        </View>
    </View>
  }
}
