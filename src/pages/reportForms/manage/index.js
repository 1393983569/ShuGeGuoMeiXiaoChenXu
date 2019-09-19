import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import DateSelect from '../../../component/dateSelect/index.js'
import DoBusiness from './DoBusiness/index.js'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '报表中心'
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          value: '经营分析',
          text: '1',
          checked: true
        },
        {
          value: '盈亏分析',
          text: '2',
          checked: false
        },
        {
          value: '会员分析',
          text: '3',
          checked: false
        }
      ]
    }
  }

  onButton (item, i) {
    const list = [...this.state.list]
    this.setState({
      list: list.map((itemx, ix) => i === ix ? {...item, checked: true} : {...item, checked: false})
    }, () => {
      console.log('这里处理状态改变后的事')
    })
  }

  // 按钮
  renderButton = () => {
    let {list} = this.state
    return (
      <View className='head-button'>
      {list.map((item, i) => {
          return (<Button style={item.checked ? {color: '#8BC34A', backgroundColor: '#ffffff'} : {color: '#ffffff', backgroundColor: 'rgba(245, 245, 245, 0)'}} size='mini' className='head-button-item' type='primary' taroKey={String(i)} onClick={this.onButton.bind(this, item, i)}>{item.value}</Button>)
      })}
    </View>
    )
  }

  getSelectDate (date) {
    console.log(date)
  }

  render () {
    return (
      <View className='box'>
        {this.renderButton()}
        <DateSelect key={new Date()} getSelectValue={this.getSelectDate.bind(this)} ></DateSelect>
        <View className='content'>
          <DoBusiness></DoBusiness>
        </View>
      </View>
    )
  }

}
