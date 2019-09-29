import Taro, { Component } from '@tarojs/taro'
import * as echarts from "./ec-canvas/echarts"

function setChartData(chart, data) {
  let option = {
    legend: {
      orient: 'vertical',
      x: 'right',
      data:['水果','肉','蔬菜','熟食','调料']
    },
    series : [
      {
        name: '',
        type: 'pie',
        center: ['30%', '50%'],
        radius: [0, '50%'],
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          normal: {
            // \n{hr|}\n{c}{d}%
            formatter: '{a|{b}}\n{hr|}\n{d|{d}%}',
            rich: {
              hr: {
                borderColor: '#0b5263',
                width: '100%',
                borderWidth: 0.5,
                height: 0
              },
              a: {
                color: '#999',
                align: 'center',
                lineHeight: 20
              },
              d: {
                align: 'center',
                lineHeight: 20
              },
            }
          }
        },
        labelLine: {
          normal: {
              length: 10,
              length2: 0,
              lineStyle: {
                  color: '#0b5263'
              }
          }
        }
      }
    ]
  }
  chart.setOption(option)
}

export default class PieChart extends Component {
  config = {
    usingComponents: {
      "ec-canvas": "./ec-canvas/ec-canvas"
    }
  }

  constructor(props) {
    super(props)
  }

  state = {
    ec: {
      lazyLoad: true
    }
  }

  refresh(data) {
    this.Chart.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      setChartData(chart, data)
      return chart
    })
  }

  refChart = node => (this.Chart = node)

  render() {
    return (
      <ec-canvas
        ref={this.refChart}
        canvas-id="mychart-area"
        ec={this.state.ec}
      />
    )
  }
}
