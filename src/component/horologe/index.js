import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text  } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.scss'
import { timingSafeEqual } from 'crypto';

export default class Horologe extends Component {
  constructor(props) {
    super(props)
    this.state= {
      timeData: '',
      timeNode: ''
    }
  }

  componentDidMount() {
    console.log(this)
    this.showTime()
  }

  componentWillUnmount () {
    this.stopHorologe()
  }

  showTime() {
    const { setData } = this.props
    this.state.timeNode = setInterval(() => {
      this.setState({
        timeData: new Date().Format("yyyy-M-d h:m:s")
      }, () => {
        setData(this.state.timeData)
      })
    }, 1000)
  }

  stopHorologe() {
    clearInterval(this.state.timeNode)
  }

  render() {
    return (
      <View>
        { this.state.timeData }
        {/* <AtButton type='primary' size='small' onClick={() => {this.stopHorologe()}}>停止计时</AtButton> */}
      </View>
    )
  }
}
