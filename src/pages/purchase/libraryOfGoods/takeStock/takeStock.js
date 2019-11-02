import Taro, { Component, useEffect, useLayoutEffect, useReducer, useState, useRef, useCallback, useMemo } from '@tarojs/taro'
import { View, Button, Text, Input, Icon, Image } from '@tarojs/components'
import Loading from '../../../../component/loading/loading'
import { selectList, getAllShopByGoods, addRecord } from '../../../../api/purchase/shoppingCart'
import { debounce, cloneMap } from '../../../../utils/auth'
import { shopSelectDetails, editRecord } from '../../../../api/purchase/compileCheck'
import { connect } from '@tarojs/redux'
import { AtMessage } from 'taro-ui'
import BottomBar from '../../../../component/bottomBar/bottomBar'
import Horologe from '../../../../component/horologe'
import ZdyButton from '../../../../component/ZdyButton'

import './index.scss'

@connect(({ counter }) => ({
  counter
}))

export default class Index extends Component{
  constructor(props) {
    super(props)
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
      shopData: new Map(),
      // 是否为编辑状态 默认不是
      editStateValue: false,
      // 编辑id
      // recordId: this.$router.params.id || '',
      // 编辑时间
      recordingTime: this.$router.params.recordingTime || ''
    }
  }

  config = {
    navigationBarTitleText: ''
  }

  componentDidMount () {
    this.getGradeList()
    Taro.setNavigationBarTitle({
      title:  this.state.editStateValue ? '编辑盘点记录' : '盘点'
    })
  }

  componentWillMount() {
    this.judgeEtid()
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

  // 获取传入的值判断是否为编辑
  judgeEtid() {
    let status = null
    if (this.state.recordingTime !== '') {
      status = true
    } else {
      status = false
    }
    console.log(status, this)
    this.setState({
      editStateValue: status
    }, () => {
      console.log('editStateValue:', this.state.editStateValue, this.state.dialogBoxState, 'status:', status)
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
    console.log(this.state.editStateValue)
    if (this.state.editStateValue) {
      this.getEditCheckData()
    } else {
      this.getAddCheckData()
    }
  }

  // 获取添加盘点的数据
  getAddCheckData() {
    getAllShopByGoods(this.state.categoryOneId, this.state.categoryTwoId, this.state.id).then(res => {
      this.setState({
        ...this.state,
        menuListData: this.echoData(res.info.map(item => {
          item.sellPrice = item.sellPrice / 100
          // 展开状态
          item.pullDownState = false
          // 多 和 少
          item.balanceMoreState = false
          item.balanceFewState = false
          // 损耗
          item.natureLoss =  false
          item.artificialLoss = false
          // 实际库存
          item.realInventory = item.amount
          // 备注
          item.remark = ''
          // 差额
          item.balance = ''
          return item
        })),
        load: 'unfinished'
      })
    }).catch(err => {
      // 提示框
      this.setState({
        load: 'on'
      })
    })
  }

  // 获取编辑盘点的数据
  getEditCheckData() {
    shopSelectDetails(
      Taro.getStorageSync('adminId').id,
      this.state.categoryOneId,
      this.state.categoryTwoId,
      // this.state.recordId,
      this.state.pageNum,
      this.state.recordingTime.substring(0, 16)).then(res => {
      this.setState({
        ...this.state,
        menuListData: res.info.records.map(item => {
          try {
            item.sellPrice = item.sellPrice ? item.sellPrice / 100 : 0
            item.sellPrice = 0
            // 展开状态
            item.pullDownState = true
            // 多 和 少
            // item.balanceMoreState = item.status === 1
            // item.balanceFewState = item.status === 2
            // 电脑库存-实际库存
            if (parseInt(item.computer_stock) - parseInt(item.actualInventory) === 0 || parseInt(item.computer_stock) - parseInt(item.actualInventory) === null) {
              item.balanceFewState = false
              item.balanceMoreState = false
            } else if (parseInt(item.computer_stock) - parseInt(item.actualInventory) > 0) {
              item.balanceFewState = true
              item.balanceMoreState = false
            } else {
              item.balanceFewState = false
              item.balanceMoreState = true
            }
            // item.balanceFewState = item.status === 2
            // 损耗
            item.natureLoss = item.loss === 2
            item.artificialLoss = item.loss === 1
            // 实际库存
            item.realInventory = item.actualInventory
            // 备注
            item.remark = item.remark
            // 差额
            // item.balance = item.difference
            item.balance = Math.abs(parseInt(item.computer_stock) - parseInt(item.actualInventory))
            item.smallImg = item.small_img
            item.amount = item.computer_stock
            return item
          } catch(e) {
            console.log(e)
          }
        }),
        load: 'on'
      })
    }).catch(err => {
      console.log(err)
      this.setState({
        load: 'unfinished'
      })
    })
  }

  // 回显已修改的商品
  echoData(list) {
    const _list = JSON.parse(JSON.stringify(list))
    list.forEach((item, index) => {
      // 遍历已保存的数据找出相同id做回显
      for (let [key, value] of this.state.shopData) {
        if (key === item.id) {
          _list[index] = value
        }
      }
    })
    return _list
  }

  // 保存多个商品
  addShopRecord(row) {
    const mapList = cloneMap(this.state.shopData)
    mapList.set(row.id, row)
    this.setState({
      shopData: mapList
    })
  }

  // 点击下拉
  clickIcon(index, state, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].pullDownState = state
    this.setState({
      menuListData: list
    })
  }

  // 点击多
  clickBalanceMoreState(index, state, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].balanceMoreState = state
    list[index].balanceFewState = false
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 点击少
  clickBalanceFewState(index, state, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].balanceFewState = state
    list[index].balanceMoreState = false
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 插入实际库存
  setInventory(index, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].realInventory = e.detail.value
    if (parseInt(list[index].amount) - parseInt(list[index].realInventory) === 0) {
      list[index].balanceFewState = false
      list[index].balanceMoreState = false
    } else if (parseInt(list[index].amount) - parseInt(list[index].realInventory) > 0) {
      list[index].balanceFewState = true
      list[index].balanceMoreState = false
    } else {
      list[index].balanceFewState = false
      list[index].balanceMoreState = true
    }
    list[index].balance = Math.abs(parseInt(list[index].amount) - parseInt(list[index].realInventory))
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 插入差额
  setBalance(index, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].balance = e.detail.value
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 插入备注
  setRemark(index, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].remark = e.detail.value
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 自然损耗
  natureLossState(index, state, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].natureLoss = state
    list[index].artificialLoss = false
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 人工损耗
  artificialLossState(index, state, e) {
    let list = JSON.parse(JSON.stringify(this.state.menuListData))
    list[index].artificialLoss = state
    list[index].natureLoss = false
    this.setState({
      menuListData: list
    }, () => {
      this.addShopRecord(list[index])
    })
  }

  // 提交盘点
  submitData() {
    // realInventory 实际库存
    // balanceMoreState 多 balanceFewState 少
    // remark 备注
    // adminId  掌柜端id this.props.counter.shopId
    // categoryTwoId 二级品类id this.state.categoryTwoId
    // amount computerStock 电脑库存
    // difference 盘点差额
    // id goodsId 商品id
    // naturalLoss 自然损耗
    // peopleLoss 人工损耗
    // remark 备注
    // 自然损耗 natureLoss
    // 人工损耗 artificialLoss
    const dataList = this.state.shopData
    const list = []
    dataList.forEach(item => {
      let loss = null
      let status = null
      console.log(item.natureLoss)
      // 1 自然损耗 2 人工损耗
      if (item.naturalLoss) {
        loss = 1
      } else if (item.artificialLoss) {
        loss = 2
      } else {
        // 如果人工损耗和自然损耗都不填写 就默认自然损耗
        loss = 1
      }
      if (item.balanceFewState) {
        status = 2
      } else if (item.balanceMoreState) {
        status = 1
      } else {
        status = ''
      }
      const data = {
        actualInventory: item.realInventory,
        balanceMoreState: item.balanceMoreState,
        balanceFewState: item.balanceFewState,
        balance: item.balance,
        remark: item.remark,
        adminId: Taro.getStorageSync('adminId').id,
        shopId: Taro.getStorageSync('adminId').shopId,
        categoryTwoId: this.state.categoryTwoId,
        computerStock: item.amount,
        goodsId: item.id,
        loss,
        status
      }
      // if (this.state.editStateValue) data.id = this.state.recordId
      list.push(data)
    })
    // editStateValue
    console.log(list)
    if (this.state.editStateValue) {
      this.edit(list)
    } else {
      this.add(list)
    }
  }

  // 添加
  add(list) {
    addRecord(list).then(res => {
      console.log(res)
      this.getMenuList()
      Taro.atMessage({
        'message': '成功',
        'type': 'success'
      })
    }).catch(err => {
      console.log(err)
      Taro.atMessage({
        'message': '失败',
        'type': 'warning'
      })
    })
  }

  // 编辑
  edit(list) {
    editRecord(list).then(res => {
      console.log(res)
      this.getMenuList()
      Taro.atMessage({
        'message': '成功',
        'type': 'success'
      })
    }).catch(err => {
      console.log(err)
      Taro.atMessage({
        'message': '失败',
        'type': 'warning'
      })
    })
  }

  setData(e) {
    // console.log(e, '@@@@@@@@@@@@@@@@@@@@@@@@')
  }

  // 点击下拉内容
  renderContentDown = (item, index) => {
    let remarkAndLoss = null
    let realInventory = parseInt(item.realInventory)
    let amount = parseInt(item.amount)
    if (isNaN(realInventory) || realInventory === amount || realInventory === amount || item.balanceMoreState) {
      remarkAndLoss = <View className='down-content-input'>
      <View>备注：</View>
      <View>
        <Input type='number' onInput={this.setRemark.bind(this, index)} value={item.remark} placeholder='请输入备注'/>
      </View>
    </View>
    } else {
      remarkAndLoss =  <View className='down-content-loss'>
        <View
            onClick={this.artificialLossState.bind(this, index, !item.artificialLoss)}
            className='down-content-loss-state'
            style={item.artificialLoss ? 'color: #8BC34A;border: #8BC34A 1Px solid;' : ''}
            >人工损耗</View>
          <View
            onClick={this.natureLossState.bind(this, index, !item.natureLoss)}
            className='down-content-loss-state'
            style={item.natureLoss ? 'color: #8BC34A;border: #8BC34A 1Px solid;' : ''}
            >自然损耗</View>
      </View>
    }
    return (
      <View className='down-content'>
        <View>
          商品ID：093010001
        </View>
        <View className='down-content-input'>
          <View>实际库存：</View>
          <View>
            <Input onInput={this.setInventory.bind(this, index)} value={item.realInventory} type='number' placeholder='请输入实际库存（斤）'/>
          </View>
        </View>
        <View className='down-content-balance'>
          <View>库存差额：</View>
          {/* onClick={this.clickBalanceMoreState.bind(this, index, !item.balanceMoreState)} */}
          <View
            className='down-content-balance-state'
            style={item.balanceMoreState ? 'color: #8BC34A;border: #8BC34A 1Px solid; margin-right: 5Px' : 'margin-right: 5Px'}
            >多</View>
          {/* onClick={this.clickBalanceFewState.bind(this, index, !item.balanceFewState)} */}
          <View
            className='down-content-balance-state'
            style={item.balanceFewState ? 'color: #8BC34A;border: #8BC34A 1Px solid;  margin-right: 5Px' : 'margin-right: 5Px'}
            >少</View>
          <View>
            <Text>{
              item.balance || '0'
             }</Text>
            {/* <Input type='number' onInput={this.setBalance.bind(this, index)} value={item.balance} style='width: 60Px' placeholder='请输入'/> */}
          </View>
          <Text>斤</Text>
        </View>
        { remarkAndLoss }
      </View>
    )
  }

  renderMenuList = () => {
    let {menuListData} = this.state
    return (
      <View>
        {
          menuListData.map((item, index) => {
            return (
              <View key={`${index}_me`} style={'border-bottom: 1Px #ECECEC solid;'} >
                <View className='menu' onClick={this.clickIcon.bind(this, index, !item.pullDownState)}>
                  <View className='menu-left'>
                    <Image
                      style='width: 60Px;height: 60Px;background: #fff;'
                      src={item.smallImg}
                    />
                  </View>
                  <View className='menu-right'>
                    <View className='menu-top-text' >
                      {item.name}
                    </View>
                    <View className='menu-inventory' >
                      <Text className='menu-centre-text'>
                        规格：优质
                      </Text>
                      <Text className='menu-centre-text'>
                        单位：斤
                      </Text>
                    </View>
                    <View className='menu-inventory'>
                      <Text className='menu-centre-text' style='color: #FF9800; font-weight: 700'>
                        电脑库存（斤）: {item.amount}
                      </Text>
                      <View className='menu-centre-text'>
                        {
                          item.pullDownState ?
                          <View className='iconfont icon_downarrow menu-centre-icon'></View> :
                          <View className='iconfont icon_uparrow menu-centre-icon'></View>
                        }
                      </View>
                    </View>
                  </View>
                </View>
                {item.pullDownState && this.renderContentDown(item, index)}
              </View>
            )
          })
        }
      </View>
    )
  }

  render () {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight -80}Px`,
      marginBottom: '25Px'
    }
    let {gradeList} = this.state
    return (
      <View>
        <View className='box-head-time'>
          <View>
            {
              this.state.editStateValue ? this.state.recordingTime : <Horologe setData={this.setData.bind(this)}/>
            }
          </View>
          <View>
            <ZdyButton name={this.state.editStateValue ? '完成编辑' : '完成盘点' } backgroundColor='#FF9C40' onClickButton={() => {this.submitData()}}/>
          </View>
        </View>
        <View className='box'>
          <View className='box-left'>
            {
              gradeList.map((item, index) => {
                return (
                  <View key={`${index}_gr`} className='box-left-location'>
                    <View onClick={this.clickStair.bind(this, index, !item.state)} className='box-left-stair'>
                      <View>
                        {item.name}
                      </View>
                      <View>
                        {
                          item.state ?
                          <View className='iconfont icon_uparrow2' style='font-size:17Px;color:#8BC34A'></View> :
                          <View className='iconfont icon_btn_selected_arrow' style='font-size:17Px;color:#8BC34A'></View>
                        }
                      </View>
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
        {/* <View className='add-bottom'>
          <Button className='add-bottom-button' onClick={this.submitData}>保存</Button>
        </View> */}
        <AtMessage/>
      </View>
    )
  }
}
