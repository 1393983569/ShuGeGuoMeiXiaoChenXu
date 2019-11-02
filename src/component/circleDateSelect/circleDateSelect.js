import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text  } from '@tarojs/components'
import './index.scss'
import {getDayNumByYearMonth} from '../../utils/auth.js'

export default class dateSelect extends Component {

  constructor(props) {
    super(props)
    this.state = {
      year: [2018],
      monthList: [],
      dayList: [],
      dateSelectValue: {
        year: '--',
        month: '--',
        day: '--'
      },
      showYear: false,
      showMonth: false,
      showDay: false
    }
  }

  componentWillMount () {
    this.onYear(this.props.defaultYear)
  }

  getYearData () {
    let year = [...this.state.year]
    let newYear = parseInt(new Date(new Date()).Format("yyyy-MM-dd").split('-')[0])
    let add = newYear - this.state.year
    for (let i = 0; add > i; i++) {
      let value = newYear++
      if (!year.includes(value)) year.push(value)
    }
    return year
  }

  getMonthData = () => {
    let monthList = []
    let month = 1
    for (let i = 0; 12 > i; i++) {
      let value = null
      if (i < 9) {
        value = `0${month++}`
      } else {
        value = month++
      }
      monthList.push(value)
    }
    this.setState({
      monthList: monthList
    })
  }

  getDayData = (day) => {
    let monthList = []
    let month = 1
    for (let i = 0; day > i; i++) {
      let value = null
      if (i < 9) {
        value = `0${month++}`
      } else {
        value = month++
      }
      monthList.push(value)
    }
    this.setState({
      dayList: monthList
    })
  }

  onYear (item) {
    this.setState({
      dateSelectValue: {...this.state.dateSelectValue, year: item, month: '--', day: '--'},
      dayList: [],
      monthList: []
    })
    this.props.getSelectValue(item)
    this.getMonthData()
  }

  onMonth (item) {
    this.setState({
      dateSelectValue: {...this.state.dateSelectValue, month: item, day: '--'},
      dayList: []
    })
    this.props.getSelectValue(`${this.state.dateSelectValue.year}-${item}`)
    let day = getDayNumByYearMonth(parseInt(this.state.dateSelectValue.year), parseInt(item))
    this.getDayData(day)
  }

  onDay (item) {
    this.setState({
      dateSelectValue: {...this.state.dateSelectValue, 'day': item}
    })
    this.props.getSelectValue(`${this.state.dateSelectValue.year}-${this.state.dateSelectValue.month}-${item}`)
  }

  selectData (name) {
    if (name === 'showYear') {
      this.setState({
        showYear: !this.state.showYear,
        showMonth: false,
        showDay: false
      })
    } else if (name === 'showMonth') {
      this.setState({
        showYear: false,
        showMonth: !this.state.showMonth,
        showDay: false
      })
    } else {
      this.setState({
        showYear: false,
        showMonth: false,
        showDay: !this.state.showDay
      })
    }
  }

  render () {
    let { monthList } = this.state
    let { showYearProps, showMonthProps, showDayProps } = this.props
    return (
      <View className='box'>
        {
          showYearProps ?
          <View className='box-content' onClick={this.selectData.bind(this, 'showYear')}>
              <Text className='box-content-year' style={{width: '30Px'}}>
                年
              </Text>
              <Text  className='box-content-yearNum'>
              {this.state.dateSelectValue.year}
              </Text>
            <View>
            {this.state.showYear &&
              <View className='box-content-list'>
                {
                  this.getYearData().map((item, i) => {
                    return (
                      <View key={`dateYear_${i}`} onClick={this.onYear.bind(this, item)}>
                        {item}
                      </View>
                    )
                  })
                }
              </View>
            }
            </View>
          </View> :
          ''
        }
        {
          showMonthProps ?
          <View className='box-content' onClick={this.selectData.bind(this, 'showMonth')}>
            <Text className='box-content-month'>
              月
            </Text>
            <Text className='box-content-monthNum'>
              {this.state.dateSelectValue.month}
            </Text>
            {this.state.showMonth &&
              <View  className='box-content-list'>
              {
                monthList.map((item, i) => {
                  return (
                    <View key={`dateMonth_${i}`} onClick={this.onMonth.bind(this, item)}>
                      {item}
                    </View>
                  )
                })
              }
            </View>
            }
          </View> :
          ''
        }
        {
          showDayProps ?
          <View className='box-content' onClick={this.selectData.bind(this, 'showDay')}>
            <Text className='box-content-day'>
              天
            </Text>
            <Text className='box-content-dayNum'>
              {this.state.dateSelectValue.day}
            </Text>
            {this.state.showDay &&
              <View  className='box-content-list'>
              {
                this.state.dayList.map((item, i) => {
                  return (
                    <View key={`dateDay_${i}`} onClick={this.onDay.bind(this, item)} >
                      {item}
                    </View>
                  )
                })
              }
            </View>
            }
          </View> : ''
        }
      </View>
    )
  }
}

dateSelect.defaultProps = {
  showYearProps: true,
  showMonthProps: true,
  showDayProps: true,
  getSelectValue: () => {
    console.log('请添加props: getSelectValue(), 返回yyyy-MM-dd')
  },
  defaultYear: new Date().getFullYear()
}
