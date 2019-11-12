import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { navigationIndex } from '../../actions/counter'
import '../../fonts/iconfont.css'

import './index.scss'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  navigationIndex (index) {
    dispatch(navigationIndex(index))
  }
}))

export default class Index extends Component{

  onClickBar(item, index, e) {
    this.props.navigationIndex(index)
    console.log(item, this.props.counter)
    Taro.redirectTo({
      url: item.url
    })
  }

  render() {
    return (
      <View className='bottomBar'>
        {
          this.props.counter.menuList.map((item, index) => {
            return (
              <View key={index + '_bar'} onClick={this.onClickBar.bind(this, item, index)}>
                <View style={index + '' === this.props.counter.navigationIndex + '' ? 'color: #8BC34A' : ''}>
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
