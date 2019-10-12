import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import ZdyButtonWidth from '../../../component/ZdyButtonWidth'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: '编辑用户'
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
            <AtInput
              className='my-atInput'
              name='value1'
              title='姓名:'
              type='text'
              placeholder='姓名'
              value={this.state.value1}
              onChange={this.handleChange.bind(this)}
            />
             <AtInput
              className='my-atInput'
              name='value1'
              title='手机号:'
              type='number'
              placeholder='手机号'
              value={this.state.value1}
              onChange={this.handleChange.bind(this)}
            />
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='box-edit-content-picker'>
                  <Text className='box-edit-content-picker-text'>当前选择：</Text>
                  <Text className='box-edit-content-picker-selecttext'>{this.state.selectorChecked}</Text>
                </View>
              </Picker>
            </View>
            <AtInput
              className='my-atInput'
              name='value1'
              title='初始密码:'
              type='number'
              placeholder='666666'
              value={this.state.value1}
              onChange={this.handleChange.bind(this)}
            />
          </View>
        </View>
        <View className='contentbotton'>
          <View className='contentbotton-flex'>
            <ZdyButtonWidth name='保存' color='#fff' backgroundColor='#8BC34A' onClickButton={this.onClickEdit}/>
          </View>
        </View>
      </View>
    )
  }
}
