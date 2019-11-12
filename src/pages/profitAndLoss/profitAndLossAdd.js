import Taro, { Component, render } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import DateSelect from '../../component/dateSelect/index'
import { selectProfitLoss } from '../../api/profitAndLoss/profitAndLossAdd'
import ZdyButtonWidth from '../../component/ZdyButtonWidth/index'
import { AtInput }  from 'taro-ui'
import './profitAndLossAdd.scss'

export default class ProfitAndLossList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      yearData: {},
      subData: {}
    }
  }

  config = {
    navigationBarTitleText: '盈亏数据'
  }

  componentDidMount() {

  }

  // 获取时间
  getSelectValue(e) {
    this.setState({
      yearData: e
    })
  }

  // 房租
  handleChangeRent(e) {
    const subData = {
      ...this.state.subData,
      rent: e
    }
    this.setState({
      subData
    })
  }

  // 工资支出
  handleChangeWages(e) {
    const subData = {
      ...this.state.subData,
      wages: e
    }
    this.setState({
      subData
    })
  }

  // 水电暖合计
  handleChangeHydropower(e) {
    const subData = {
      ...this.state.subData,
      hydropower: e
    }
    this.setState({
      subData
    })
  }

  // 其它固定费用总计
  handleChangeOtherExpenses(e) {
    const subData = {
      ...this.state.subData,
      otherExpenses: e
    }
    this.setState({
      subData
    })
  }

  // 营销费用
  handleChangeMarketing(e){
    const subData = {
      ...this.state.subData,
      marketing: e
    }
    this.setState({
      subData
    })
  }

  // 其它可变费用总计
  handleChangeOtherVariables(e) {
    const subData = {
      ...this.state.subData,
      otherVariables: e
    }
    this.setState({
      subData
    })
  }

  // 提交
  onClickSub() {
    const data = this.state.subData
    data.updateTime = this.state.yearData
    selectProfitLoss(data).then(res => {
      this.setState({
        subData: {}
      })
    }).catch(err => {

    })
  }

  render() {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight}Px`
    }
    return <View className='profitAndLossList-box'>
    <ScrollView
        className='scrollview scrollviewHeight'
        scrollY
        scrollWithAnimation
        scrollTop={scrollTop}
        style={scrollStyle}
        lowerThreshold={Threshold}
        upperThreshold={Threshold}
        >
        <View className='profitAndLossList-box-content'>
          <View className='profitAndLossList-box-content-head'>
            <DateSelect showDayProps={false} getSelectValue={this.getSelectValue.bind(this)}/>
          </View>
          <View className='profitAndLossList-box-content-gd'>
            <View className='profitAndLossList-box-content-gd-head'>
              <View>固定成本</View>
              <View className='profitAndLossList-box-content-gd-solid'></View>
            </View>
            <View className='input-flex'>
              <View>
                房租（元）：
              </View>
              <AtInput
                className='my-input'
                name='rent'
                type='number'
                placeholder='请输入数字'
                value={this.state.subData.rentValue}
                onChange={this.handleChangeRent.bind(this)}
              />
            </View>
            <View className='input-flex'>
            <View>
              工资支出（元）：
            </View>
            <AtInput
              className='my-input'
              name='wages'
              type='number'
              placeholder='请输入数字'
              value={this.state.subData.wagesValue}
              onChange={this.handleChangeWages.bind(this)}
            />
            </View>
            <View className='input-flex'>
            <View>
              水电暖合计（元）：
            </View>
            <AtInput
              className='my-input'
              name='hydropower'
              type='number'
              placeholder='请输入数字'
              value={this.state.subData.hydropowerValue}
              onChange={this.handleChangeHydropower.bind(this)}
            />
            </View>
            <View className='input-flex'>
            <View>
              其它固定费用总计（元）：
            </View>
            <AtInput
              className='my-input'
              name='otherExpenses'
              type='number'
              placeholder='请输入数字'
              value={this.state.subData.otherExpensesValue}
              onChange={this.handleChangeOtherExpenses.bind(this)}
            />
            </View>
          </View>
          <View className='profitAndLossList-box-content-kb'>
            <View className='profitAndLossList-box-content-kb-head'>
              <View>可变成本</View>
              <View className='profitAndLossList-box-content-kb-solid'></View>
            </View>
            <View className='input-flex'>
            <View>
              营销费用（元）：
            </View>
            <AtInput
              className='my-input'
              name='marketing'
              type='number'
              placeholder='请输入数字'
              value={this.state.subData.marketingValue}
              onChange={this.handleChangeMarketing.bind(this)}
            />
            </View>
            <View className='input-flex'>
            <View>
              其它可变费用总计（元）：
            </View>
            <AtInput
              className='my-input'
              name='otherVariables'
              type='number'
              placeholder='请输入数字'
              value={this.state.subData.otherVariablesValue}
              onChange={this.handleChangeOtherVariables.bind(this)}
            />
            </View>
          </View>
        </View>
        <View className='profitAndLossList-box-button'>
          <ZdyButtonWidth name='确定' color='#fff' backgroundColor='#8BC34A' onClickButton={() => this.onClickSub()}/>
        </View>
      </ScrollView>
    </View>
  }
}
