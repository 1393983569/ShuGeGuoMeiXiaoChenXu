import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import '../../fonts/iconfont.css'

import './index.scss'

@connect(({ counter }) => ({
  counter
}))

export default class Index extends Component{

  onClickBar(item, e) {
    console.log(item)
    Taro.navigateTo({
      url: item.url
    })
  }

  render() {
    return (
      <View className='bottomBar'>
        {
          this.props.counter.menuList.map((item, index) => {
            return (
              <View key={index + '_bar'} onClick={this.onClickBar.bind(this, item)}>
                <View>
                  <View>
                    <View className={`iconfont ${item.icon}`} style='font-size:30Px'></View>
                  </View>
                  <Text style='font-size: 14Px'>
                    {item.name}
                  </Text>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
