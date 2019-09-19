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
    return (
      <Button className='box' style={`background-color: ${this.props.backgroundColor};border-radius: ${this.props.radius};color: ${this.props.color}`} onClick={() => {this.props.onClickButton()}}>
        {this.props.name}
      </Button>
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
  onClickButton: PropTypes.func
}

loading.defaultProps = {
  // 按钮内容
  name: '#fff',
  // 按钮圆角
  radius: '15Px',
  color: '#fff',
  onClickButton: () => {}
}
