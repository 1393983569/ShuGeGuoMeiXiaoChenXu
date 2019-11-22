import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { AtMessage } from 'taro-ui'
import BottomBar from '../../../component/bottomBar/bottomBar'
import { selectPageCart, addCart, deleteCart, addShopOrder } from '../../../api/purchase/shoppingCart'
import { connect } from '@tarojs/redux'
import { setOrderState } from '../../../actions/counter'
import './index.scss'

// 获取redux
@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  setOrderState (state) {
    dispatch(setOrderState(state))
  }
}))

export default class Index extends Component{
  constructor (props) {
    super(props)
    this.state = {
      menuListData: [],
      startX: 0,
      delBtnWidth: '70',
      endData: 0,
      id: Taro.getStorageSync('adminId').id,
      shopId: Taro.getStorageSync('adminId').shopId,
      totalPrices: 0,
      totalPricesEslectState: false,
      delAnimate: '',
      endX: 0,
      animatio: {}
    }
  }

  config = {
    navigationBarTitleText: '购物车'
  }

  componentDidMount () {
    this.getShoppingCart()
  }


  componentWillMount() {
    // 创建动画
    this.setState({
      animatio: Taro.createAnimation({
        duration: 50,
        timingFunction: 'linear'
      })
    })
  }

  renderShoppingList(item, indexF) {
    let {shoppingList} = item
    return(
      <View>
          {
            shoppingList.map((shopItem, shopIndex) => {
             return <View className='menu-box' key={`${shopIndex}_me`} >
              <View className='menu'
              animation={shopItem.delAnimate}
              // style={`right: ${shopItem.txtStyle}Px;`}
              onTouchStart={this.touchS}
              onToucHend={e => this.touchH(e, indexF, shopIndex)}
              >
                <View className='menu-select'>
                  {
                    shopItem.selectState ?
                    <View className='iconfont icon_selectedall select-icon' onClick={this.selectChildren.bind(this, indexF, shopIndex, !shopItem.selectState)}></View> :
                    <View className='iconfont icon_unselectall select-icon' onClick={this.selectChildren.bind(this, indexF, shopIndex, !shopItem.selectState)}></View>
                  }
                </View>
                <View className='menu-left'>
                  <Image
                    style='width: 90Px;height: 90Px;background: #fff;'
                    src={shopItem.bigImg}
                  />
                </View>
                <View className='menu-right'>
                  <View className='menu-top-text'>
                    {shopItem.name}
                  </View>
                  <View>
                    <Text className='menu-centre-text'>
                      规格: {shopItem.standards}
                    </Text>
                    <Text className='menu-centre-text'>
                      单位: {shopItem.unit}
                    </Text>
                  </View>
                  <View className='menu-bottom-text'>
                    <View className='menu-centre-price'>
                      ￥{shopItem.purchasePrice}
                    </View>
                    <View className='menu-centre-num'>
                      <View className='menu-centre-num-left' onClick={this.changeNum.bind(this, shopItem.amount, '0', shopItem.id, shopIndex, indexF)}>
                        -
                      </View>
                      <View className='menu-centre-num-centre'>
                        {/* {shopItem.amount} */}
                        <View className='menu-centre-num-centre'>
                          <Input type='text' value={shopItem.amount} className='menu-centre-num-centre-input' onBlur={ this.inputNum.bind(this, shopItem.id, indexF) }/>
                        </View>
                      </View>
                      <View className='menu-centre-num-right' onClick={this.changeNum.bind(this, shopItem.amount, '1', shopItem.id, shopIndex, indexF)}>
                        +
                      </View>
                    </View>
                  </View>
                </View>
                </View>
                <View className='delete' onClick={this.delShopping.bind(this, shopItem.id, indexF, shopIndex)}>
                    删除
                </View>
              </View>
            })
          }
      </View>
    )
  }

  renderShopList() {
    let { menuListData } = this.state
    const scrollTop = 0
    const Threshold = 40
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight - 500}Px`
    }
    return(
     <View>
        {
          menuListData.map((item, index) => {
            return (
              <View key={index + '_m'} className='shoppingList'>
                <View className='select-f'>
                {
                  item.parentSelectState ?
                  <View className='iconfont icon_selectedall select-icon' onClick={this.selectFather.bind(this, index, !item.parentSelectState)}></View> :
                  <View className='iconfont icon_unselectall select-icon' onClick={this.selectFather.bind(this, index, !item.parentSelectState)}></View>
                }
                <Text style='font-size:17Px;margin-left: 5Px;'>{item.category}</Text>
                </View>
                {this.renderShoppingList(item, index)}
                <View style='font-size: 17Px;line-height: 30Px;height: 30Px;padding: 10Px;'>
                  <Text style='float: left'>
                    小计金额
                  </Text>
                  <Text style='float: right'>
                    ￥{item.subtotal}
                  </Text>
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }

  // 获取列表数据
  getShoppingCart() {
    selectPageCart(this.state.id).then(res => {
      let data = {}
      let listData = []
      res.info.forEach((item, index) => {
        if (!data[item.categoryOne.name]) {
          let {goodsDomain} = item
          data[item.categoryOne.name] = []
          data[item.categoryOne.name].push({
            name: goodsDomain.name,
            bigImg: goodsDomain.bigImg,
            purchasePrice: goodsDomain.sellPrice / 100,
            unit: goodsDomain.unit,
            amount: item.number,
            selectState: false,
            category: item.categoryOne.name,
            txtStyle: 0,
            id: goodsDomain.id,
            categoryOneId: item.categoryOne.id,
            standards: goodsDomain.standards,
            goodsId: item.goodsId
          })
        } else {
          let {goodsDomain} = item
          data[item.categoryOne.name].push({
            name: goodsDomain.name,
            bigImg: goodsDomain.bigImg,
            purchasePrice: goodsDomain.purchasePrice / 100,
            unit: goodsDomain.unit,
            amount: item.number,
            selectState: false,
            category: item.categoryOne.name,
            txtStyle: 0,
            id: goodsDomain.id,
            categoryOneId: item.categoryOne.id,
            standards: goodsDomain.standards,
            goodsId: item.goodsId
          })
        }
      })
      for (let key in data) {
        let subtotal = 0
        data[key].forEach(item => {
          subtotal += parseInt(item.purchasePrice) * parseInt(item.amount)
        })
        listData.push({
          category: key,
          parentSelectState: false,
          subtotal,
          shoppingList: data[key]
        })
      }
      this.setState({
        menuListData: listData
      }, () => this.getTotalPrices())
    }).catch(err => {
      console.log(err)
    })
  }

  // 添加购物车 state 0 减 1 加
  changeNum(num, state, id, index, indexF, e) {
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
      let subtotal = 0
      list[indexF].shoppingList[index].amount = data.number
      // list[indexF].subtotal
      list[indexF].shoppingList.forEach(item => {
        subtotal += parseInt(item.purchasePrice) * parseInt(item.amount)
      })
      list[indexF].subtotal = subtotal
      this.setState({
        ...this.state,
        menuListData: list,
        load: 'on'
      }, () => this.getTotalPrices())
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

  // 删除
  delShopping(id, indexF, index, e) {
    let dataList = JSON.parse(JSON.stringify(this.state.menuListData))
    deleteCart(id).then(res => {
      dataList[indexF].shoppingList.splice(index, 1)
      this.setState({
        menuListData: dataList
      }, () => this.getTotalPrices())
    }).catch(err => {

    })
  }

  // 子选中
  selectChildren(Findex, indexChildren, state, e) {
    let dataList = JSON.parse(JSON.stringify(this.state.menuListData))
    let data = dataList[Findex].shoppingList[indexChildren]
    data.selectState = state
    this.setState({
      menuListData: dataList
    }, () => this.getTotalPrices())
  }

  // 父选中
  selectFather(index, state, e) {
    let dataList = JSON.parse(JSON.stringify(this.state.menuListData))
    let shoppingList = []
    dataList[index].shoppingList.forEach(item => {
      shoppingList.push({
        ...item, selectState: state
      })
    })
    dataList[index].shoppingList = shoppingList
    dataList[index].parentSelectState = state
    this.setState({
      menuListData: dataList
    }, () => this.getTotalPrices())
  }

  // 计算总价
  getTotalPrices() {
    // totalPrices
    let prices = 0
    this.state.menuListData.forEach(item => {
      item.shoppingList.forEach(itemx => {
        if (itemx.selectState) {
          prices += parseInt(itemx.purchasePrice) * parseInt(itemx.amount)
        }
      })
    })
    this.setState({
      totalPrices: prices
    })
  }

  // 全选
  selectTotalPrices(state, e) {
    let dataList = JSON.parse(JSON.stringify(this.state.menuListData))
    let list = []
    dataList.forEach((item, indedx) => {
      let newShoppingList = []
      let newData = {
        ...item,
        parentSelectState: state
      }
      item.shoppingList.forEach(itemx => {
        newShoppingList.push({
          ...itemx,
          selectState: state
        })
      })
      newData.shoppingList = newShoppingList
      list.push(newData)
    })
    this.setState({
      totalPricesEslectState: state,
      menuListData: list
    }, () => this.getTotalPrices())
  }

  // 消息提示
  handleMessage (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  // 生成订单
  createOrder() {
    let list = []
    // console.log(Taro.getStorageSync('adminId'))
    this.state.menuListData.forEach(item => {
      item.shoppingList.forEach(itenx => {
        if (itenx.selectState) {
          let data = {
            ...itenx,
            goodsName: itenx.name,
            money: parseInt(itenx.amount) * parseInt(itenx.purchasePrice) * 100,
            price: itenx.purchasePrice * 100
          }
          delete data.bigImg
          delete data.category
          delete data.id
          delete data.purchasePrice
          delete data.selectState
          delete data.txtStyle
          list.push(data)
        }
      })
    })
    if (list.length > 0) {
      addShopOrder(list, this.state.totalPrices * 100, this.state.shopId).then(res => {
        this.getShoppingCart()
        this.props.setOrderState('未拆单')
        Taro.navigateTo({
          url: '/pages/purchase/orderForm/orderParticulars?orderId=' + res.info.orderNo + '&state="未拆单"'
        })
      }).catch(err => {
        this.handleMessage('warning', err)
      })
    } else {

    }
  }

  touchS = (e) => {
    const startX = e.touches[0].clientX
    // 滑动开始的坐标
    this.setState({
      startX
    }, () => {
      console.log(startX, '开始')
    })
  }

  touchH = (e, indexF, index) => {
    console.log(e.changedTouches[0].clientX, '结束')
    const { startX, menuListData, animatio } = this.state
    const list = menuListData
    const _animatio = animatio
    const endX = e.changedTouches[0].clientX
    const distance = Math.floor(startX) - Math.floor(endX)
    if (distance > 40) {
      _animatio.translateX(-70).step()
      // 展示删除
      list[indexF].shoppingList[index].delAnimate = _animatio.export()
      this.setState({
        menuListData: list,
      })
    } else if (distance < -40){
      _animatio.translateX(0).step()
      // 复位
      list[indexF].shoppingList[index].delAnimate = _animatio.export()
      this.setState({
        menuListData: list
      })
    }
  }

  render() {
    return (
      <View>
         <AtMessage />
        <View className='box'>
          <View className='box-list'>
            {this.renderShopList()}
            <View className='box-list-fill'></View>
          </View>
        </View>
        <View className='totalPrices'>
          <View className='totalPrices-content'>
            <Button size='mini' className='totalPrices-content-button' onClick={this.createOrder}>生成订单</Button>
            <Text className='totalPrices-content-text'>
              合计: ￥{this.state.totalPrices}
            </Text>
            {
              this.state.totalPricesEslectState?
              <View className='iconfont icon_selectedall totalPrices-content-select' onClick={this.selectTotalPrices.bind(this, !this.state.totalPricesEslectState)}></View> :
              <View className='iconfont icon_unselectall totalPrices-content-select' onClick={this.selectTotalPrices.bind(this, !this.state.totalPricesEslectState)}></View>
            }
            <Text className='totalPrices-content-all-select'>全选</Text>
          </View>
        </View>
        <BottomBar/>
      </View>
    )
  }
}
