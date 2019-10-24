import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import './index.scss'

export default class CategoryLisst extends Component {

  config = {
    navigationBarTitleText: '经营品类'
  }

  render() {
    const { list } = this.props
    return <View className='category-list-box'>
      <View className='category-list-box-head'>
        <View className='category-list-box-head-left'>
          一级品类
        </View>
        <View className='category-list-box-head-right'>
          二级品类
        </View>
      </View>
      {
        list.map(item => {
          return <View className='category-list-box-content' key={ item.name }>
            <View className='category-list-box-content-left'>
              <View>{ item.name }</View>
            </View>
            <View className='category-list-box-content-right'>
              {
                item.seconds.map(item => {
                  return <View className='category-list-box-content-right-content' key={item.id}>{ item.name }</View>
                })
              }
            </View>
          </View>
        })
      }
    </View>
  }

}
