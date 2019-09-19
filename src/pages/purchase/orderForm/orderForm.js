import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import DateSelect from '../../../component/circleDateSelect/circleDateSelect.js'
import BottomBar from '../../../component/bottomBar/bottomBar'
import BePutInStorage from './bePutInStorage'
import Delivery from './delivery'
import DidNotOpen from './didNotOpen'
import HasBeenOpened from './hasBeenOpened'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      buttonListData: [
        {
          name: '未拆单',
          clickState: true
        },
        {
          name: '已拆单',
          clickState: false
        },
        {
          name: '已派单',
          clickState: false
        },
        {
          name: '已入库',
          clickState: false
        }
      ],
      buttonFormClick: '未拆单'
    }
  }

  config = {
    navigationBarTitleText: '订单'
  }

  // 获取日期
  getSelectValue(e) {
    console.log(e)
  }

  // 按钮切换
  clickButton(name, e) {
    console.log(name)
    let list = this.state.buttonListData.map(item => {
      let data = {}
      if (item.name === name) {
        data = {
          ...item,
          clickState: true
        }
      } else {
        data = {
          ...item,
          clickState: false
        }
      }
      return data
    })
    this.setState({
      buttonFormClick: name,
      buttonListData: list
    })
  }

  render () {
    let { buttonListData, buttonFormClick } = this.state
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 190}Px`,
      marginBottom: '25Px'
    }
    return (
      <View>
        <View className='item'>
          <DateSelect getSelectValue={e => this.getSelectValue(e)}></DateSelect>
        </View>
        <View className='box'>
          <View className='box-head loading-status'>
            {
              buttonListData.map((item, index) => {
                return (
                  <View className='box-head-button' style={item.clickState ? 'background-color: #8BC34A;color: #fff;' : 'background-color: #fff;color: #8BC34A;' } key={index + '_b'} onClick={this.clickButton.bind(this, item.name)}>
                    {item.name}
                  </View>
                )
              })
            }
          </View>
          <View className='order'>
            <ScrollView
              className='scrollview'
              scrollY
              scrollWithAnimation
              style={scrollStyle}
            >
               {buttonFormClick === '未拆单' && <DidNotOpen/>}
               {buttonFormClick === '已拆单' && <HasBeenOpened/>}
               {buttonFormClick === '已派单' && <Delivery/>}
               {buttonFormClick === '已入库' && <BePutInStorage/>}
            </ScrollView>
          </View>
        </View>
        <BottomBar/>
      </View>
    )
  }
}
