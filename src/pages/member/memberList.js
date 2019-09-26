import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import Loading from '../../component/loading/loading'
import { queryMember } from '../../api/member/memberList'
import './index.scss'

export default class Index extends Component {

  constructor () {
    this.state = {
      dataList: [],
      pageNum: 1
    }
  }

  config = {
    navigationBarTitleText:'会员列表'
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    const { pageNum } = this.state
    queryMember(pageNum).then(res => {
      console.log(res, '**********************************')
      res.info.records.map(item => {
        return {
          balance: item.balance,
          id: item.id,
          mobile: item.mobile
        }
      })
    }).catch(err => {

    })
  }

  render() {
    return (
      <View className='box'>
        <View className='conten'>
          <View className='box-head'>
            <View className='box-head-left'>
              <View>
                <Image
                 style='width: 40Px;height: 40Px;border-radius: 4Px;'
                 src='https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'/>
              </View>
              <View>
                1500264789415002647894
              </View>
            </View>
            <View className='box-head-right'>
              <Text>银牌会员</Text>
              <View className='iconfont icon_home_marketingcenter_rightarrow box-head-right-icon'></View>
            </View>
          </View>
          <View className='box-bottom'>
            <View className='box-bottom-button-left'>
              VIP会员
            </View>
            <View style='color: #8BC34A;'>|</View>
            <View className='box-bottom-button-right'>
              余额：3212.00
            </View>
          </View>
        </View>
      </View>
    )
  }
}
