import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, RichText } from '@tarojs/components'
import { shopFindMessage } from '../../api/InformationForDetails'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '资讯详情'
  }

  constructor(props) {
    super(props)
    this.state = {
      id: null,
      data: {}
    }
  }

  componentDidMount() {
    this.getList()
  }

  // 获取数据
  getList() {
    shopFindMessage(this.$router.params.id).then(res => {
      console.log(res)
      const data = {}
      data.content = res.info.message.content
      data.title = res.info.message.title
      this.setState({
        data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  render () {
    return (
      <View className='box'>
        <View>{ this.state.data.title }</View>
        <View>
          <RichText nodes={ this.state.data.content }/>
        </View>
      </View>
    )
  }
}
