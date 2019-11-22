import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Icon } from '@tarojs/components'
import Loading from '../../../component/loading/loading'
import { selectList, shopSelectGoods, addCart } from '../../../api/purchase/shoppingCart'
import { debounce } from '../../../utils/auth'
import { connect } from '@tarojs/redux'
import BottomBar from '../../../component/bottomBar/bottomBar'

import './index.scss'

@connect(({ counter }) => ({
  counter
}))

export default class Index extends Component{
  constructor(props) {
    super(props)
    // const { menuList } =
    this.state = {
      load: '',
      menuListData: [],
      gradeList: [],
      categoryOneId: '',
      categoryTwoId: '',
      pageNum: 1,
      id: Taro.getStorageSync('adminId').id,
      shopId: Taro.getStorageSync('adminId').shopId
    }
  }

  // 跳转商品详情
  shopParticulars(id) {
    Taro.navigateTo({
      url: '/pages/purchase/libraryOfGoods/goodsShelfDetails/goodsShelfDetails?id=' + id
    })
  }

  config = {
    navigationBarTitleText: '货架'
  }

  renderMenuList = () => {
    let {menuListData} = this.state
    return (
      <View>
        {
          menuListData.map((item, index) => {
            return (
              <View className='menu' key={`${index}_me`}>
                <View className='menu-left'>
                  <Image
                    onClick={this.shopParticulars.bind(this, item.id)}
                    style='width: 90Px;height: 90Px;background: #fff;'
                    src={item.smallImg}
                  />
                </View>
                <View className='menu-right'>
                  <View className='menu-top-text'>
                    {item.name}
                  </View>
                  <View>
                    <Text className='menu-centre-text'>
                      规格: {item.standards}
                    </Text>
                    <Text className='menu-centre-text'>
                      单位: {item.unit}
                    </Text>
                  </View>
                  <View className='menu-bottom-text'>
                    <View className='menu-centre-price'>
                      ￥{item.sellPrice ? Math.floor(item.sellPrice) : 0}
                    </View>
                    <View className='menu-centre-num'>
                      <View className='menu-centre-num-left' onClick={this.changeNum.bind(this, item.amount, '0', item.id, index)}>
                        -
                      </View>
                      <View className='menu-centre-num-centre'>
                        <Input type='text' value={item.amount} className='menu-centre-num-centre-input' onBlur={ this.inputNum.bind(this, item.id, index) }/>
                      </View>
                      <View className='menu-centre-num-right' onClick={this.changeNum.bind(this, item.amount, '1', item.id, index)}>
                        +
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }

  componentDidMount () {
    this.getGradeList()
  }

  getGradeList() {
    let list = []
    this.setState({
      ...this.state,
      gradeList: []
    })
    selectList(Taro.getStorageSync('adminId').shopId).then(res => {
      JSON.parse(res.info).forEach(element => {
        list.push(
          {
            id: element.id,
            name: element.name,
            state: false,
            seconds: element.seconds.map(secondsItem => {
              let {categoryOneId, id, name} = secondsItem
              return {
                categoryOneId,
                id,
                name,
                state: false
              }
            })
          }
        )
      })
      this.setState({
        gradeList: list
      }, () => {
        this.setState({
          categoryOneId: this.state.gradeList[0].id,
          categoryTwoId: this.state.gradeList[0].seconds[0].id
        }, () => {
          this.getMenuList()
        })
      })
    }).catch(err => {

    })
  }

  // 点击一级
  clickStair(index, state) {
    let list = JSON.parse(JSON.stringify(this.state.gradeList))
    list[index].state = state
    this.setState({
      gradeList: list
    })
  }

  // 点击子类
  clickChildren(fIndex, index, id, state) {
    let childrenList = []
    let categoryOneId = ''
    let categoryTwoId = ''
    this.setState({
      gradeList: [],
      menuListData: []
    })
    let list = JSON.parse(JSON.stringify(this.state.gradeList)).map(item => {
      return {
        id: item.id,
        name: item.name,
        state: item.state,
        seconds: item.seconds.map(secondsItem => {
          let {categoryOneId, id, name, standards, unit} = secondsItem
          return {
            categoryOneId,
            id,
            name,
            state: false
          }
        })
      }
    })
    list[fIndex].seconds[index].state = state
    this.setState({
      categoryOneId: list[fIndex].id,
      categoryTwoId: id,
      gradeList: list,
      // pageNum: 1,
      load: 'on'
    }, () => {
      this.getMenuList()
    })
  }

  // 获取商品列表
  getMenuList() {
    // 加载状态
    this.setState({
      load: 'loading'
    })
    shopSelectGoods(this.state.categoryOneId, this.state.categoryTwoId, this.state.id).then(res => {
      this.setState({
        ...this.state,
        menuListData: res.info.map(item => {
          item.sellPrice = item.sellPrice / 100
          return item
        }),
        load: 'on'
      })
    }).catch(err => {
      // 提示框
      Taro.showToast({
        title: '获取商品失败',
        icon: 'none',
        duration: 1000
      })
      this.setState({
        load: 'on'
      })
    })
  }

  // 添加购物车 state 0 减 1 加
  changeNum(num, state, id, index, e) {
    let list = this.state.menuListData
    let numValue = state === '1' ? parseInt(num) + 1 : parseInt(num) - 1
    let data = {
      number: numValue < 0 ? 0 : numValue,
      goodsId: id,
      adminId: this.state.id,
      categoryOneId: this.state.categoryOneId,
      categoryTwoId: this.state.categoryTwoId,
      shopId: this.state.shopId
    }
    addCart(data).then(res => {
      list[index].amount = data.number
      console.log(list[index])
      this.setState({
        ...this.state,
        menuListData: list,
        load: 'on'
      })
      // this.getMenuList()
    }).catch(err => {
      console.log(err)
    })
  }

  // 输入框
  inputNum(id, index, e) {
    let list = this.state.menuListData
    let data = {
      goodsId: id,
      adminId: this.state.id,
      categoryOneId: this.state.categoryOneId,
      categoryTwoId: this.state.categoryTwoId,
      shopId: this.state.shopId,
      number: e.detail.value
    }
    addCart(data).then(res => {
      list[index].amount = data.number
      console.log(list[index])
      this.setState({
        ...this.state,
        menuListData: list,
        load: 'on'
      })
      // this.getMenuList()
    }).catch(err => {
      console.log(err)
    })
   }

  render () {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 40}Px`,
      transform: 'translate3d(0,0px,0)'
    }
    let {gradeList} = this.state
    return (
      <View className='box'>
        <View className='box-left' style={'margin-bottom: 90Px'}>
          {
            gradeList.map((item, index) => {
              return (
                <View key={`${index}_gr`}>
                  <View onClick={this.clickStair.bind(this, index, !item.state)} className={'box-left-stair'}>
                    <Text style={'float: left'}>
                      {item.name}
                    </Text>
                    {
                      item.state ?
                      <View className='iconfont icon_uparrow2' style='font-size:17Px;color:#8BC34A'></View> :
                      <View className='iconfont icon_btn_selected_arrow' style='font-size:17Px;color:#8BC34A'></View>
                    }
                  </View>
                  <View className={item.state ? 'box-left-show' : 'box-left-hide'}>
                    {
                      item.seconds.map((secondsItem, secondsIndex) => {
                        return (
                          <View
                            onClick={this.clickChildren.bind(this, index, secondsIndex, secondsItem.id, true)}
                            key={`${secondsIndex}_se`}
                            className={secondsItem.state ? 'box-left-centre box-left-showColor' : 'box-left-centre box-left-hideColor'}>
                            {secondsItem.name}
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              )
            })
          }
        </View>
        <View className='box-right'>
        <ScrollView
          className='scrollview scrollviewHeight'
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          style={'margin-bottom: 80Px'}
          // onScrollToLower={this.onScrollToLower}
        >
          {this.renderMenuList()}
          <Loading load={this.state.load}/>
          </ScrollView>
        </View>
        <BottomBar/>
      </View>
    )
  }
}
