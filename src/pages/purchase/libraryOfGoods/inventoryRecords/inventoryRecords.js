import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import DateSelect from '../../../../component/circleDateSelect/circleDateSelect.js'
import ZdyButton from '../../../../component/ZdyButton'
import Loading from '../../../../component/loading/loading'
import { shopPageRecord } from '../../../../api/purchase/inventoryRecords'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      load: 'on',
      dateValue: '',
      pageNum: 1,
      dataList: [],
      queryState: true
    }
  }

  config = {
    navigationBarTitleText: '盘点记录'
  }

  componentDidMount() {
    this.getList()
  }

  // d: Taro.getStorageSync('adminId').id 当前用户id
  getList() {
    const dataValue = this.state.dateValue + ''
    if (!this.state.queryState) {
      this.onState()
      return
    }
    this.loadingState()
    let dateList = ''
    if (this.state.dateValue) {
      if (dataValue.includes('-')) {
        dateList = this.state.dateValue.split('-')
      } else {
        dateList = [this.state.dateValue]
      }
    }
    let year = ''
    let month = ''
    let day = ''
    if (dateList.length > 0) {
      year = dateList[0]
      month = dateList[1]
      day = dateList[2]
    }
    shopPageRecord(year, month, day, this.state.pageNum).then(res => {
      // 判断是否有数据
      if (res.info.records.length < 1) {
        this.onState()
      } else {
        this.unfinishedState()
      }
      const data = JSON.parse(JSON.stringify(this.state.dataList))
      res.info.records.forEach((item, index) => {
        data.push({
          time: item.recording_time,
          id: item.id
        })
      })
      this.setState({
        dataList: data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  onClickDelete() {
    console.log('ssssssssssssss')
  }

  onClickEdit() {
    console.log('aaaaaaaaaaa')
  }

  getSelectValue(e) {
    console.log(e)
    this.setState({
      dateValue: e,
      queryState: true,
      dataList: [],
      pageNum: 1
    }, () => {
      this.getList()
    })
  }

  // 数据未完
  unfinishedState() {
    this.setState({
      load: 'unfinished'
    })
  }

  // 数据已完
  onState() {
    this.setState({
      load: 'on',
      queryState: false
    })
  }

  // 加载状态
  loadingState() {
    this.setState({
      load: 'loading'
    })
  }

  // 滑到底部触发
  onScrollToLower() {
    let pageNum = this.state.pageNum
    pageNum += 1
    this.setState({
      pageNum
    }, () => {
      this.getList()
    })
  }

  // 跳转详情
  skipParticulars(id, recordingTime, e) {
    Taro.navigateTo({
      url: '/pages/purchase/libraryOfGoods/takeStock/takeStock?id=' + id + '&recordingTime=' + recordingTime
    })
  }

  render() {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight -75}Px`
    }
    return (
      <View>
        <View className='box-head'>
          <DateSelect getSelectValue ={e => this.getSelectValue(e)}/>
        </View>
        <View className='box'>
        <ScrollView
          className='scrollview scrollviewHeight'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToLower={this.onScrollToLower}
          >
          {
            this.state.dataList.map((item, index) => {
              return <View className='box-content' onClick={ this.skipParticulars.bind(this, item.id, item.time) } key={index + '_p'}>
                <View className='box-content-head'>
                  <View>
                    盘点时间：{item.time}
                  </View>
                  <View>
                    <View className='iconfont icon_rightarrow' style='font-size:17Px;color:#8BC34A'></View>
                  </View>
                </View>
                <View className='box-content-bottom'>
                  <View className='box-content-bottom-text' style='color: #CACACA; font-size: 12Px;'>
                    盘点表详情
                  </View>
                  <View className='box-content-bottom-text-button'>
                    <View>
                      <ZdyButton name='删除' color='#666' onClickButton={this.onClickDelete}/>
                    </View>
                    <View>
                      <ZdyButton name='编辑' color='#666' onClickButton={this.onClickEdit}/>
                    </View>
                  </View>
                </View>
              </View>
            })
          }
          <Loading load={this.state.load}/>
        </ScrollView>
        </View>
      </View>
    )
  }
}
