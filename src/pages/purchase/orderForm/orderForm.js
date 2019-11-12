import Taro, { Component } from '@tarojs/taro'
import { View, Button, Input } from '@tarojs/components'
import { AtInput, AtIcon }  from 'taro-ui'
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
      buttonFormClick: '未拆单',
      searchValue: ''
    }
  }

  config = {
    navigationBarTitleText: '订单'
  }

  componentWillMount() {
    Taro.setStorageSync('orderItem', '')
  }

  // 未拆单
  didNotOpenRef = (node) => this.refDidNotOpen = node
  // 已拆单
  hasBeenOpenedRef = (node) => this.refHasBeenOpened = node
  // 已派单
  deliveryRef = (node) => this.refDelivery = node
  // 已入库
  bePutInStorageRef = (node) => this.refBePutInStorage = node

  // 获取日期
  getSelectValue(e) {
    Taro.setStorageSync('orderItem', e)
    this.judgeFunction()
  }

  // 搜索
  clickSearch() {
    this.judgeFunction()
  }

  // 判断调用哪个
  judgeFunction() {
    if (this.refDidNotOpen || this.refHasBeenOpened || this.refDelivery || this.refBePutInStorage) {
      switch (this.state.buttonFormClick) {
        case '未拆单':
          this.refDidNotOpen.getList()
          break;
        case '已拆单':
          this.refHasBeenOpened.getList()
          break;
        case '已派单':
          this.refDelivery.getList()
          break;
        case '已入库':
          this.refBePutInStorage.getList()
          break;
        default:
          break;
      }
    }
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

  // 搜索输入框
  handleChangeSearch(e) {
    Taro.setStorageSync('orderName', e.target.value)
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
          <View className='at_input'>
            <View className='at_input_contennt'>
              <Input
                  className='my_input'
                  type='text'
                  placeholder='请输入订单编号和商品名称进行搜索'
                  onInput={this.handleChangeSearch.bind(this)}
                />
              <View
                onClick={() => this.clickSearch()}
                className='my_icon'>
                <AtIcon className='zdy_at_icon' value='search' size='20' color='#fff'/>
              </View>
            </View>
          </View>
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
               {buttonFormClick === '未拆单' && <DidNotOpen ref={this.didNotOpenRef}/>}
               {buttonFormClick === '已拆单' && <HasBeenOpened ref={this.hasBeenOpenedRef}/>}
               {buttonFormClick === '已派单' && <Delivery ref={this.deliveryRef}/>}
               {buttonFormClick === '已入库' && <BePutInStorage ref={this.bePutInStorageRef}/>}
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
