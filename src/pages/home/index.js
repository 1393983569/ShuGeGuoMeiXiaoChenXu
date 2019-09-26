import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input, Icon, Swiper, SwiperItem } from '@tarojs/components'
import imgPng from '../../img/img_bg.png'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      menuList: {
        // 报表
        statement: [
          {
            name: '经营分析',
            url: '/pages/reportForms/manage/index',
            icon: 'icon_home_operationanalysis'
          },
          {
            name: '盈亏报告(未做)',
            url: '/pages/purchase/goodsShelf/goodsShelf',
            icon: 'icon_home_profitandlosslist'
          },
          {
            name: '会员分析(未做)',
            url: '/pages/purchase/libraryOfGoods/libraryOfGoodsList',
            icon: 'icon_home_vipanalysis'
          }
        ],
        // 采购平台
        purchase: [
          {
            name: '货架',
            url: '/pages/purchase/goodsShelf/goodsShelf',
            icon: 'icon_tab_shoppingcart_normal'
          },
          {
            name: '购物车',
            url: '/pages/purchase/shoppingCart/shoppingCart',
            icon: 'icon_tab_shelf_normal'
          },
          {
            name: '订单',
            url: '/pages/purchase/orderForm/orderForm',
            icon: 'icon_tab_shelf_normal'
          }
        ],
        // 商品系统
        commodity: [
          {
            name: '商品库',
            url: '/pages/purchase/libraryOfGoods/libraryOfGoodsList',
            icon: 'icon_home_commoditybank'
          },
          {
            name: '盘点',
            url: '/pages/purchase/libraryOfGoods/takeStock/takeStock',
            icon: 'icon_home_inventory'
          },
          {
            name: '盘点记录',
            url: '/pages/purchase/libraryOfGoods/inventoryRecords/inventoryRecords',
            icon: 'icon_commoditybank_inventorylist'
          },
          {
            name: '预警设置',
            url: '/pages/earlyWarning/index',
            icon: 'icon_home_warningset'
          }
        ],
        // 会员系统
        member: [
          {
            name: '会员列表(未做)',
            url: '/pages/purchase/orderForm/orderForm',
            icon: 'icon_home_viplist'
          }
        ],
        // 后台系统
        management: [
          {
            name: '后台用户',
            url: '/pages/backgroundTheUser/backgroundTheUser',
            icon: 'icon_home_backstageuser'
          },
          {
            name: '店铺设置(未做)',
            url: '/pages/purchase/orderForm/orderForm',
            icon: 'icon_home_shopset'
          },
          {
            name: '盈亏数据设置(未做)',
            url: '/pages/purchase/orderForm/orderForm',
            icon: 'icon_home_profitandlossdataSetting'
          }
        ]
      }
    }
  }

  config = {
    navigationBarTitleText: '首页',
    navigationBarBackgroundColor: '#404C55'
  }

  // 页眉提示
  renderHint = (text) => {
    return <View className='hint'>
      <View className='iconfont icon_home_massage hint-icon'></View>
      <View className='dot' />
    </View>
  }

  // 轮播图
  renderSwiper = () => {
    return <Swiper
    className='test-h'
    indicatorColor='#999'
    indicatorActiveColor='#333'
    circular
    indicatorDots
    autoplay='true'
    >
      <SwiperItem>
        <View className='demo-text-1'>1</View>
      </SwiperItem>
      <SwiperItem>
        <View className='demo-text-2'>2</View>
      </SwiperItem>
      <SwiperItem>
        <View className='demo-text-3'>3</View>
      </SwiperItem>
    </Swiper>
  }

  // 营销平台
  renderMarketing = () => {
    return <View className='marketing' >
      <View className='iconfont icon_home_marketingcenter marketing-icon'></View>
      <View className='marketingText' >
        <View>营销平台</View>
        <View>选择适合自己店铺的营销方案</View>
      </View>
    </View>
  }

  // 报表中心 后面都采用此组件
  renderStatement = (text, list) => {
    return <View className='statement'>
      <View className='text'>
        {text}
      </View>
      <View className='icon-bar'>
      {
        list.map((item, index) => {
            return <View key={`${index}_m`} className='icon-bar-item' onClick={this.clickUrl.bind(this, item.url)}>
              <View className={`iconfont ${item.icon} icon-bar-icon`}></View>
              <View>{item.name}</View>
            </View>
        })
      }
      </View>
    </View>
  }

  clickUrl(e) {
    Taro.navigateTo({
      url: e
    })
  }

  render () {
    const scrollStyle = {
      height: '100%'
    }
    return (
      <View className='box' style={`background: url(${imgPng})`}>
        <ScrollView
        className='scrollview'
        scrollY
        scrollWithAnimation
        style={scrollStyle}
        >
          <View className='head'>
            <Text>店长-天水路店</Text>
            {this.renderHint(5)}
          </View>
          <View>
            {this.renderSwiper()}
          </View>
          {this.renderMarketing()}
          {this.renderStatement('报表中心', this.state.menuList.statement)}
          {this.renderStatement('采购平台', this.state.menuList.purchase)}
          {this.renderStatement('商品系统', this.state.menuList.commodity)}
          {this.renderStatement('会员系统', this.state.menuList.member)}
          {this.renderStatement('后台系统', this.state.menuList.management)}
        </ScrollView>
      </View>
    )
  }
}
