import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'
import { shopSelectDetails } from '../../api/personalCenter/personalCenter'
import './index.scss'

export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      img: '',
      name: '',
      simpleName: '',
      roleName: '',
      mobile: ''
    }
  }

  config = {
    navigationBarTitleText: '个人中心'
  }

  componentDidMount() {
    this.getList()
  }

  editPassword() {
    Taro.navigateTo({
      url: '/pages/personalCenter/editPassword'
    })
  }

  getList() {
    shopSelectDetails(Taro.getStorageSync('adminId').id).then(res => {
      this.setState({
        img: res.info.shopDomain.imge,
        name: res.info.name,
        simpleName: res.info.shopDomain.simpleName,
        roleName: res.info.role.name,
        mobile: res.info.mobile
      })
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const { img, name, simpleName, roleName, mobile } = this.state
    return <View className='box'>
      <View style={`background: url(http://qiniu.freshergo.com/1570763640184.png)`}>
        {/* <View style='font-size: 24Px;color: #8BC34A;padding-top: 5Px;' className='iconfont icon_back_arrow forgetPassword-box-head-left-icon'></View> */}
        <View style='font-size: 24Px;color: #8BC34A;padding-top: 10Px;'></View>
        <View className='box-img'>
          <View className='box-img-head-portrait'>
            <AtAvatar circle='true' size='large' image={ img }></AtAvatar>
          </View>
          <View className='box-img-name'>
            { name }
          </View>
          <View className='box-img-shop'>
            <View style='width: 59%'>{ simpleName }</View>
            <View>|</View>
            <View style='width: 49%'>{ roleName }</View>
          </View>
        </View>
      </View>
      <View className='box-user'>
          <View className='box-user-phone'>
            手机号：{ mobile }
          </View>
          <View className='box-user-password' onClick={() => this.editPassword()}>
            <View className='box-user-password-left'>
              修改密码
            </View>
            <View className='box-user-password-right'>
              <View style='font-size: 14Px;' className='iconfont icon_rightarrow marketing-icon'></View>
            </View>
          </View>
          <View className='box-user-out'>
            退出登录
          </View>
      </View>
    </View>
  }

}
