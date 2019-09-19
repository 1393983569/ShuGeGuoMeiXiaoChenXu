import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Icon, Image } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '商品详情'
  }

  render () {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 5}Px`,
      marginBottom: '25Px'
    }
    // (?<=:)\w+
    // json_string = json_string.replace(/(?:\s*['"]*)?(\w+)(?:['"]*\s*)?:((?<=:)\w+)/g, "'$1':'$2'");

    return (
      <View className='box'>
          <ScrollView
          className='scrollview scrollviewHeight'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
        >
        <View >
          <View className='box-head'>
            <Image
              className='box-imge'
              src='http://qiniu-sggm.sandianke.com/1562725793736.jpg'
            />
            <View className='box-head-state'>
              已上线
            </View>
          </View>
          <View  className='box-one'>
            <View>
              草莓
            </View>
            <View className='box-one-name'>
              <View>
                采购价
              </View>
              <View>
                零售价
              </View>
              <View>
                折扣率
              </View>
              <View>
                折扣价
              </View>
            </View>
          </View>
          <View className='box-tow'>
            <View>品类：蔬菜-叶茎类</View>
            <View>商品条码：6970712370224</View>
            <View>商品ID：093010001</View>
            <View>规格：优质</View>
            <View>单位：斤</View>
            <View>标签:</View>
          </View>
          <View className='box-tow'>
            <View>
              人工损耗（斤）：15
            </View>
            <View>
              自然损耗（斤）：5
            </View>
          </View>
          <View className='box-tow'>
            <View>
              保质期预警：10天
            </View>
            <View>
              保鲜期预警：48小时
            </View>
          </View>
          <View className='box-tow' style='height: 30Px;line-height: 30Px;'>
            产地：国内-甘肃省-兰州市
          </View>
          <View className='box-tow'  style='height: 30Px;line-height: 30Px;'>
            电脑库存（斤）：30
          </View>
          <View className='box-tow'  style='height: 30Px;line-height: 30Px;'>
            备注：当季蔬菜
          </View>
          <View>
            <Button className='btn-max-w box-button' plain >下载</Button>
          </View>
        </View>
        </ScrollView>
      </View>
    )
  }

}
