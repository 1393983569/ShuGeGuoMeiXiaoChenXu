import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import Loading from '../../component/loading/loading'
import './index.scss'

export default class Index extends Component{

  constructor (props) {
    super(props)
    this.state = {
      dataList: [
        {
          title: '库存预警',
          annotation:'注：库存数量低于每日销售量的百分比',
          state: false,
          value: '50%'
        },
        {
          title: '保质期预警',
          annotation:'注：到期前X天',
          state: false,
          value: '3天'
        },
        {
          title: '保鲜期预警',
          annotation:'注：入库时间开始计倒计时',
          state: false,
          value: '24小时'
        }
      ]
    }
  }

  config = {
    navigationBarTitleText:'预警设置'
  }

  // 编辑/保存 状态
  handleState(state, index, e) {
    const dataList = JSON.parse(JSON.stringify(this.state.dataList))
    dataList[index].state = true
    this.setState({
      dataList
    })
  }

  handleAdd(index) {
    const dataList = JSON.parse(JSON.stringify(this.state.dataList))
    dataList[index].state = false
    this.setState({
      dataList
    })
  }

  render () {
    const {dataList} = this.state
    return(
      <View className='box'>
        {
          dataList.map((item, index) => {
            return (
              <View className='box-content' key={index + '_sz'}>
                <View className='box-content-hear'>
                  <View>
                    {item.title}
                  </View>
                  <View>
                    {
                      item.state ?
                      <Button className='btn-max-w box-content-button' plain type='primary' onClick={this.handleAdd.bind(this, index)}>保存</Button> :
                      <Button className='btn-max-w box-content-button' plain type='primary' onClick={this.handleState.bind(this, !item.state, index)}>编辑</Button>
                    }
                  </View>
                </View>
                {
                  item.state ?
                  <Input type='text' value={item.value} className='box-content-input'/> :
                  <View className='box-content-input'>
                    <Text style='color: #8BC34A'>{item.value}</Text> （默认）
                  </View>
                }
                <View className='box-content-bottom'>
                  {item.annotation}
                </View>
              </View>
            )
          })
        }
      </View>
    )
  }
}
