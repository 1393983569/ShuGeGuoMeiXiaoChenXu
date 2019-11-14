import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Loading from '../../component/loading/loading'
import { selectPageRecord } from '../../api/information'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '消息中心'
  }

  constructor(props) {
    super(props)
    this.state = {
      list: [
        {
          value: '通知',
          text: '通知',
          checked: true
        },
        {
          value: '资讯',
          text: '资讯',
          checked: false
        }
      ],
      content: [],
      load: '',
      state: 1,
      pageNum: 1,
      pageSize: null,
      shopId: Taro.getStorageSync('adminId').shopId,
      loadingState: true
    }
  }

  componentDidMount() {
    this.getList()
  }

  onButton (item, i) {
    const list = [...this.state.list]

    list.map((itemx, ix) => {
      itemx.checked = false
      if ( i + '' === ix + '') {
        itemx.checked = true
      }
      return itemx
    })
    this.setState({
      list
    }, () => {
      // 0通知 1咨询
      let state = null
      if (item.value === '通知') {
        state = 0
      } else {
        state = 1
      }
      this.setState({
        state,
        // 切换消息和资讯时初始化状态
        content: [],
        loadingState: true,
        load: 'unfinished',
        pageNum: 1
      }, () => {
        this.getList()
      })
    })
  }

  getList() {
    this.setState({load: 'loading'})
    selectPageRecord(this.state.state, this.state.pageNum, this.state.pageSize, this.state.shopId).then(res => {
      if (res.info.records.length > 0) {
        const list = this.state.content
        res.info.records.forEach((item, index) => {
          list.push({
            title: item.message.title,
            updateTime: item.message.updateTime,
            img: item.message.thumbnail,
            id: item.id
          })
        })
        this.setState({
          content: list,
          load: 'unfinished'
        })
      } else {
        this.setState({
          loadingState: false,
          load: 'on'
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  onScrollToLower(e){
    console.log(this.state.loadingState, this.state.load)
    if (!this.state.loadingState) return
    let pageNum = this.state.pageNum
    pageNum += 1
    this.setState({
      pageNum
    }, () => {
      this.getList()
    })
  }

  onContent (item) {
    console.log(item)
    Taro.navigateTo({
      url: '/pages/InformationForDetails/index?id=' + item.id
    })
  }

  // 按钮
  renderButton = () => {
    let {list} = this.state
    return (
      <View className='head'>
      {list.map((item, i) => {
          return (<Button style={item.checked ? {color: '#8BC34A', backgroundColor: '#ffffff'} : {color: '#ffffff', backgroundColor: 'rgba(245, 245, 245, 0)'}} size='mini' className='head-button' type='primary' taroKey={String(i)} onClick={this.onButton.bind(this, item, i)}>{item.text}</Button>)
      })}
    </View>
    )
  }

  render () {
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 45}Px`
    }
    return (
      <View className='box'>
        {this.renderButton()}
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
        {/* 内容 */}
        {this.state.content.map((item, i) => {
          return (
            <View className='box-content' key={i + '_c'} onClick={this.onContent.bind(this, item)} >
            <View className='box-content-text'>
              <View className='box-content-headline'>
                {item.title}
              </View>
              <View className='box-content-text-date'>
                {item.updateTime}
              </View>
            </View>
            <View className='box-content-img'>
              <Image
                style='width: 120Px;height: 80Px;background: #fff;'
                src={item.img}
              />
            </View>
          </View>
          )
        })}
        <Loading load={this.state.load} />
        </ScrollView>
      </View>
    )
  }
}
