import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import PropTypes from 'prop-types';
import './index.scss'

class loading extends Component {

  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    // line-height: ${this.props.lineHeight};
    return (
      <View style='width: 100%; position: relative;'>
        <Button className='box' style={`line-height: ${this.props.lineHeight}; background-color: ${this.props.backgroundColor};border-radius: ${this.props.radius};color: ${this.props.color}; border: 1Px solid ${this.props.borderColor}`} onClick={() => {this.props.onClickButton()}}>
          {this.props.name}
        </Button>
      </View>
    )
  }
}

loading.propTypes = {
  backgroundColor: PropTypes.string,
  radius: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  color: PropTypes.string,
  onClickButton: PropTypes.func,
  borderColor: PropTypes.string,
  lineHeight: PropTypes.string
}

loading.defaultProps = {
  // 按钮内容
  name: '#fff',
  // 按钮圆角
  radius: '15Px',
  color: '#fff',
  onClickButton: () => {},
  borderColor: '#E2E2E2',
  lineHeight: '20px'
}
