import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput } from 'taro-ui'
import ZdyButtonWidth from '../../../component/ZdyButtonWidth'
import { selectRole } from '../../../api/backgroundTheUser/newAdd'
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

  componentDidMount() {
    this.getSelectRole()
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

  getSelectRole() {
    selectRole().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
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
              placeholder='请输入用户姓名'
              value={this.state.value1}
              onChange={this.handleChange.bind(this)}
            />
            <View>
              <Picker mode='selector' range={this.state.selector} onChange={this.onChange}>
                <View className='box-edit-content-picker'>
                  <Text className='box-edit-content-picker-text'>当前选择：</Text>
                  {
                    this.state.selectorChecked !== '' ?
                    <Text className='box-edit-content-picker-selecttext'>{this.state.selectorChecked}</Text>:
                    <Text className='box-edit-content-picker-not-to-choose'>请选择角色</Text>
                  }

                </View>
              </Picker>
            </View>
             <AtInput
              className='my-atInput'
              name='value1'
              title='手机号:'
              type='number'
              placeholder='请输入用户手机号'
              value={this.state.value1}
              onChange={this.handleChange.bind(this)}
            />
            <AtInput
              className='my-atInput'
              name='value1'
              title='初始密码:'
              type='number'
              placeholder='请输入用户初始密码'
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
