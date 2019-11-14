import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { selectEarly, addEarly } from '../../api/earlyWarning/index'
import { AtMessage } from 'taro-ui'
import Loading from '../../component/loading/loading'
import './index.scss'

export default class Index extends Component{

  constructor (props) {
    super(props)
    this.state = {
      dataList: []
    }
  }

  config = {
    navigationBarTitleText:'预警设置'
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    selectEarly(Taro.getStorageSync('adminId').shopId).then(res => {
      console.log(res)
      const list = []
      res.info.forEach(item => {
        switch (item.type) {
          case 1:
            list.push({
              value: item.number,
              id: item.id,
              annotation:'注：库存数量低于每日销售量的百分比',
              state: false,
              title: '库存预警',
              inputValue: item.number,
              defaultStaet: item.number === 50,
              type: item.type
            })
            break;
          case 2:
            list.push({
              value: item.number,
              id: item.id,
              annotation:'注：到期前X天',
              state: false,
              title: '保质期预警',
              inputValue: item.number,
              defaultStaet: item.number === 3,
              type: item.type
            })
            break;
          case 3:
            list.push({
              value: item.number,
              id: item.id,
              annotation:'注：入库时间开始计倒计时',
              state: false,
              title: '保鲜期预警',
              inputValue: item.number,
              defaultStaet: item.number === 24,
              type: item.type
            })
            break;
          default:
            break;
        }
      })
      this.setState({
        dataList: list
      })
    }).catch(err => {
      console.log(err)
    })
  }

  // 打开编辑
  handleState(state, index, e) {
    const dataList = JSON.parse(JSON.stringify(this.state.dataList))
    dataList[index].state = true
    this.setState({
      dataList
    })
  }

  // 保存
  handleAdd(index) {
    const dataList = JSON.parse(JSON.stringify(this.state.dataList))
    let newList = []
    dataList[index].state = false
    dataList[index].value = dataList[index].inputValue || 0
    dataList.forEach((item, _index) => {
      let defaultStaet = false
      switch(item.type) {
        case 1:
          defaultStaet = item.value + '' === '50'
          break
        case 2:
          defaultStaet = item.value + '' === '3'
          break
        case 3:
          defaultStaet = item.value + '' === '24'
          break
        default:
        break
      }
      newList.push({
        ...item,
        defaultStaet
      })
    })
    const subData = {
      id: dataList[index].id,
      number: dataList[index].value,
      shopId: Taro.getStorageSync('adminId').shopId,
      type: dataList[index].type
    }
    addEarly(subData).then(res => {
      this.handleClick('success', '成功')
      this.setState({
        dataList: newList
      })
    }).catch(err => {
      this.handleClick('warning', '失败')
    })
  }

  blurInput(e, index) {
    const dataList = JSON.parse(JSON.stringify(this.state.dataList))
    dataList[index].inputValue = e.target.value
    this.setState({
      dataList
    })
  }

  // 消息提示
  handleClick (type, text) {
    Taro.atMessage({
      'message': text,
      'type': type,
    })
  }

  render () {
    const {dataList} = this.state
    return(
      <View className='box'>
        <AtMessage/>
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
                  <Input type='text' value={item.value} onInput={(e) => this.blurInput(e, index)} className='box-content-input'/> :
                  <View className='box-content-input'>
                    <Text style='color: #8BC34A'>{item.value}</Text>
                    {
                      item.defaultStaet ? '（默认）' : ''
                    }
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
