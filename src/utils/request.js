import { axios } from 'taro-axios'
import store from '../store'
import { REACT_APP_BASE_API } from '../config'
import Taro from '@tarojs/taro'

const service = axios.create({
  baseURL: REACT_APP_BASE_API, // 后端地址
  // withCredentials: true, // 当跨域请求时发送cookie
  timeout: 5000 // 等待时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 让每个请求携带令牌
    // ['X-Token']是一个自定义头键
    // 请根据实际情况修改
    // config.headers['X-Token'] = getToken()
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 判断后台状态
    if (res.status !== 1) { // 错误状态
      // 判断具体的状态是否过期等等
      if (res.status === 2) {
        // 过期跳转登录
        Taro.navigateTo({
          url: '/pages/login/index'
        })
      }
      return Promise.reject(res.info)
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
