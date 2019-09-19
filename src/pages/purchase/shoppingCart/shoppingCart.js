import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import BottomBar from '../../../component/bottomBar/bottomBar'
import { selectPageCart, addCart, deleteCart, addShopOrder } from '../../../api/purchase/shoppingCart'

import './index.scss'

export default class Index extends Component{
  constructor (props) {
    super(props)
    this.state = {
      menuListData: [],
      startX: '',
      delBtnWidth: '70',
      endData: 0,
      id: Taro.getStorageSync('adminId').id,
      shopId: Taro.getStorageSync('adminId').shopId,
      totalPrices: 0,
      totalPricesEslectState: false
    }
  }

  config = {
    navigationBarTitleText: '购物车'
  }

  componentDidMount () {
    this.getShoppingCart()
  }

  renderShoppingList(item, indexF) {
    let {shoppingList} = item
    return(
      <View>
          {
            shoppingList.map((shopItem, shopIndex) => {
             return <View className='menu-box' key={`${shopIndex}_me`} >
              <View className='menu' style={`right: ${shopItem.txtStyle}Px;`} onTouchStart={this.touchS} onTouchMove={e => this.touchM(e, indexF, shopIndex)} onToucHend={e => this.touchH(e, indexF, shopIndex)}>
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
                        {shopItem.amount}
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
            money: parseInt(itenx.amount) * parseInt(itenx.purchasePrice),
            price: itenx.purchasePrice
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
      addShopOrder(list, this.state.totalPrices, this.state.shopId).then(res => {
        console.log(res)
      }).catch(err => {
        Taro.showToast(
          {
            title: '失败',
            icon: 'none',
            duration: 1000
          }
        )
      })
    } else {

    }
  }

  touchS = (e) => {
    // 滑动开始的坐标
    this.setState({
      startX: e.touches[0].clientX
    })
  }

  touchH = (e, indexF, index) => {
    const getList = (state) => {
      let dataList = JSON.parse(JSON.stringify(this.state.menuListData))
      let data = dataList[indexF].shoppingList[index]
      // 循环父
      if (state) {
        data.txtStyle = 70
      } else {
        let num = data.txtStyle
        data.txtStyle = num - 15
        if (data.txtStyle < 0) {
          data.txtStyle = 0
          clearInterval(setTime)
        }
      }
      return dataList
    }
    if (this.state.endData < this.state.delBtnWidth) {
      var setTime = setInterval(() => {
        this.setState({
          menuListData: getList(false)
        })
      }, 5)
    } else {
      this.setState({
        menuListData: getList(true)
      })
    }
  }

  touchM = (e, indexF, index) => {
    if (e.touches.length === 1) {
      let dataList = JSON.parse(JSON.stringify(this.state.menuListData))
      let data = dataList[indexF].shoppingList[index]
      // 记录触摸点位置的X坐标
      let moveX = e.touches[0].clientX
      let txtStyle = this.state.menuListData[indexF].shoppingList[index].txtStyle
      // 计算起始点坐标与当前触摸点的差值
      let disX = this.state.startX - moveX
      // 删除按钮宽度
      let delBtnWidth = this.state.delBtnWidth
      if (disX < 40 && txtStyle < 40) {
        txtStyle = "0"
      } else {
        // 如果大于按钮宽度 就恒定为按钮宽度
        if (disX > delBtnWidth) {
          txtStyle = delBtnWidth
        } else {
          txtStyle = disX
        }
      }
      data.txtStyle = txtStyle
      this.setState({
        menuListData: dataList,
        endData: txtStyle
      })
    }
  }

  render() {
    return (
      <View>
        <View className='box'>
          <View className='box-list'>
            {this.renderShopList()}
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
