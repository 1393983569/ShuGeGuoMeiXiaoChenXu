import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: ''
  }

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      title: this.$router.params.name
    })
  }

  render() {
    return(
      <View className='box'>
        <View className='box-content'>
          <View>
            ID：205190201001
          </View>
          <View>
            姓名：天一
          </View>
          <View>
            手机号：15002090365
          </View>
          <View>
            角色：店长
          </View>
          <View>
            注册日期：2019-02-01  13：00
          </View>
        </View>
        <View className='box-content'>
          <View>
            操作日志
          </View>
        </View>
      </View>
    )
  }

}
