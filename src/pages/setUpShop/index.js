import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import CategoryList from './categoryList'
import OfficeList from './officeList'
import { queryShop } from '../../api/setUpShop/setUpShopIndex'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shopData: {
        imge: []
      }
    }
  }

  config = {
    navigationBarTitleText: '店铺设置'
  }

  componentDidMount() {
    this.getList()
  }

  // 获取数据
  getList() {
    queryShop(Taro.getStorageSync('adminId').shopId).then(res => {
      const data = res.info
      data.categoryJson = JSON.parse(res.info.categoryJson)
      data.imge = res.info.imge.split(',').map(item => {
        return item
      })
      console.log(data)
      this.setState({
        shopData: data
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 滑动到底部
  onScrollToLower() {

  }

  render() {
    const scrollTop = 0
    const Threshold = 60
    let windowHeight = Taro.getSystemInfoSync().windowHeight
    const scrollStyle = {
      height: `${windowHeight}Px`
    }
    const { shopData } = this.state
    return <View className='box'>
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
        <View className='box-content'>
          <View className='margin-top-bottom-10'>店铺ID：{shopData.id}</View>
          <View className='margin-top-bottom-10'>店铺名称：{shopData.name}</View>
          <View className='margin-top-bottom-10'>店铺简称：{shopData.simpleName}</View>
          <View>
            <View style="margin-bottom: 10Px">店铺照片：</View>
            {
              shopData.imge.map((item, index) => {
                return <View className='box-content-img' key={item}>
                  <Image
                    style='width: 100%;height: 170px;'
                    src={item}
                  />
                  <View className='iconfont icon_deletephoto_clicked box-content-img-icon-del'></View>
                  <View className='box-content-img-name'>
                    照片一
                  </View>
                </View>
              })
            }
          </View>
        </View>
        {/* 经营品类 */}
        <View className='box-content'>
          <CategoryList list={shopData.categoryJson}/>
        </View>
        {/* 职员情况 */}
        <View className='box-content'>
          <OfficeList list={shopData.shopStaffList} refreshList={() => this.getList()}/>
        </View>
      </ScrollView>
    </View>
  }

}
