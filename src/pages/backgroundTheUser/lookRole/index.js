import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: '新建用户'
  }

  constructor () {
    super(...arguments)
    this.state = {
      value: '',
      selector: ['美国', '中国', '巴西', '日本'],
      selectorChecked: ''
    }
  }

  handleChange (value) {
    this.setState({
      value
    })
  }

  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }

  render() {
    return(
      <View className='box-edit'>
        <View className='box-edit-content'>
          <View className='box-edit-content-querydata'>
            <View className='box-edit-content-querydata-box'>
              <View className='box-edit-content-querydata-box-left'>
                角色名称
              </View>
              <View className='box-edit-content-querydata-box-right'>
                角色权限
              </View>
            </View>
            <View className='box-edit-content-querydata-box'>
              <View className='box-edit-content-querydata-box-left'>
                1545
              </View>
              <View className='box-edit-content-querydata-box-right'>
                84456456
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
