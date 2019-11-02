import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Icon, Image } from '@tarojs/components'
import Loading from '../../../component/loading/loading'
import { selectList, getAllShopByGoods} from '../../../api/purchase/shoppingCart'
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
    const { menuList } =
    this.state = {
      load: '',
      menuListData: [],
      gradeList: [],
      categoryOneId: '',
      categoryTwoId: '',
      pageNum: 1,
      id: Taro.getStorageSync('adminId').id,
      shopId: Taro.getStorageSync('adminId').shopId,
      dialogBoxState: false,
      handleDialogState: false
    }
  }

  config = {
    navigationBarTitleText: '商品库'
  }

  renderMenuList = () => {
    let {menuListData} = this.state
    return (
      <View>
        {
          menuListData.map((item, index) => {
            return (
              <View key={`${index}_me`} style={'border-bottom: 1Px #ECECEC solid;'}>
                <View className='menu' onClick={this.shopParticulars.bind(this)}>
                  <View className='menu-left'>
                    <Image
                      style='width: 60Px;height: 60Px;background: #fff;'
                      src={item.goodsDomain.bigImg}
                    />
                  </View>
                  <View className='menu-right'>
                    <View className='menu-top-text' >
                      {item.name}
                    </View>
                    <View className='menu-inventory' >
                      <Text className='menu-centre-text'>
                        电脑库存（斤）: {item.amount}
                      </Text>
                      <View className='menu-centre-text'>
                        <View className='iconfont icon_rightarrow menu-centre-icon'></View>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='border-menu'>
                  <View className='border-menu-left'>
                    零售价: {Math.floor(item.price) / 100}￥
                  </View>
                  <View className='border-menu-right'>
                    折扣价: 字段待定
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
    selectList().then(res => {
      res.info.forEach(element => {
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
    // // 如果已经到底不在访问接口
    // if (this.state.load === 'on') {
    //   // this.setState({
    //   //   load: 'end'
    //   // })
    //   return
    // }
    // 加载状态
    this.setState({
      load: 'loading'
    })
    getAllShopByGoods(this.state.categoryOneId, this.state.categoryTwoId, this.state.id).then(res => {
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

  // 点击更多
  dialogBox(state, e) {
    console.log(state, e)
    // 判断是否可以点击页面其他地方关闭
    if (state) {
      this.setState({
        handleDialogState: true
      })
    } else {
      this.setState({
        handleDialogState: false
      })
    }
    this.setState({
      dialogBoxState: state
    })
  }

  // 跳转
  showInventoryRecords(url, e) {
    Taro.navigateTo({
      url: url
    })
  }

  // 跳转商品详情
  shopParticulars() {
    Taro.navigateTo({
      url: '/pages/purchase/libraryOfGoods/particulars/particulars'
    })
  }

  render () {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 60}Px`,
      marginBottom: '25Px'
    }
    let {gradeList} = this.state
    return (
      <View>
        <View className='heat-date'>
          <View>
            <Text>
              2019-2-25
            </Text>
          </View>
          <View>
            <View className='heat-date-right' onClick={this.dialogBox.bind(this, !this.dialogBoxState)}>
              . . .
            </View>
          </View>
          <View onClick={this.dialogBox.bind(this, !this.dialogBoxState)} className={this.dialogBoxState ? 'heat-date-dialogBox' : 'heat-date-dialogBoxHide'}>
            <View className='heat-date-dialogBox-item' onClick={this.showInventoryRecords.bind(this, '/pages/purchase/libraryOfGoods/inventoryRecords/inventoryRecords')}>
              <View className='heat-date-dialogBox-item-left'>
                <View className='iconfont icon_commoditybank_inventorylist heat-date-dialogBox-item-left-text'></View>
              </View>
              <View className='heat-date-dialogBox-item-right'>
                盘点记录
              </View>
            </View>
            <View className='heat-date-dialogBox-item' onClick={this.showInventoryRecords.bind(this, '/pages/purchase/libraryOfGoods/takeStock/takeStock')}>
              <View className='heat-date-dialogBox-item-left'>
                <View className='iconfont icon_commoditybank_inventory heat-date-dialogBox-item-left-text'></View>
              </View>
              <View className='heat-date-dialogBox-item-right'>
                盘点
              </View>
            </View>
            <View className='heat-date-dialogBox-item' onClick={this.showInventoryRecords.bind(this, '/pages/earlyWarning/index')}>
              <View className='heat-date-dialogBox-item-left'>
                <View className='iconfont icon_commoditybank_warningset heat-date-dialogBox-item-left-text'></View>
              </View>
              <View className='heat-date-dialogBox-item-right'>
                预警设置
              </View>
            </View>
          </View>
        </View>
        <View className='box' onClick={() => {
          if (this.state.handleDialogState) {
            this.dialogBox(false)
          }
        }}>
          <View className='box-left'>
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
            // onScrollToLower={this.onScrollToLower}
          >
            {this.renderMenuList()}
            <Loading load={this.state.load}/>
            </ScrollView>
          </View>
        </View>
      </View>
    )
  }
}
