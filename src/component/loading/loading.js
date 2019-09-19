import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import './index.scss'

class loading extends Component {
  constructor(props) {
    super(props)
    this.state ={

    }
  }

  render () {
    const isLoggedIn = this.props.load
    let status = null
    if (isLoggedIn === 'loading') {
      status = status = <View className="spinner">
        <View className="spinner-container container1">
            <View className="circle1"></View>
            <View className="circle2"></View>
            <View className="circle3"></View>
            <View className="circle4"></View>
        </View>
        <View className="spinner-container container2">
            <View className="circle1"></View>
            <View className="circle2"></View>
            <View className="circle3"></View>
            <View className="circle4"></View>
        </View>
        <View className="spinner-container container3">
            <View className="circle1"></View>
            <View className="circle2"></View>
            <View className="circle3"></View>
            <View className="circle4"></View>
        </View>
      </View>
    } else if (isLoggedIn === 'on') {
      status = <View className='onHint'> 到底了 </View>
    } else {
      status = ''
    }
    return (
      <View style={{textAlign: 'center'}} className='box'>
        {status}
      </View>
    )
  }
}
export default loading
