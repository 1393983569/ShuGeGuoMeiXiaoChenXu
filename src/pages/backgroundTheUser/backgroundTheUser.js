import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component{

  config = {
    navigationBarTitleText: '后台用户'
  }

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  // 查看详情
  clickRole() {
    Taro.navigateTo({
      url: '/pages/backgroundTheUser/particulars/index?name=' + '店长 天一'
    })
  }

  render() {
    return(
      <View className='box'>
        <View style='padding: 11Px 14Px; background-color: #ffffff;overflow: hidden'>
          <View style='float: right; color: #8BC34A;'>
            角色
          </View>
        </View>
        <View className='box-content'>
          <View className='box-content-item'>
            <View className='box-content-item-left'>
              <View style='font-size: 14Px; width: 50%'>
                天一
              </View>
              <View  style='font-size: 14Px;color: #999999; '>
                205190425001
              </View>
            </View>
            <View className='box-content-item-right' onClick={this.clickRole}>
              <View style='font-size: 14Px;'>
                店长
              </View>
              <View style='font-size: 12Px;color: #999999;'>
                注册时间：2019-02-01 13：00
              </View>
              <View>
                <View className='iconfont icon_rightarrow' style='font-size:17Px;color:#8BC34A'></View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
