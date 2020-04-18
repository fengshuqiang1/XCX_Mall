import {login} from '../../utils/asyncWx.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入网络请求函数
import {request} from '../../request/index.js';
Page({
  //获取用户信息和登陆的code用于获取token
  async handleGetUserInfo(res) {
    try {
      const {encryptedData,rawData,iv,signature} = res.detail
      //获取用户登陆的token
      const {code} = await login()
      //整理发送请求需要用到的数据
      const requsetData = {encryptedData,rawData,iv,signature,code}
      // 发送请求获取token值(注意这一步只有企业微信号才能实现！！！)
      let token = await request({
        url: '/users/wxlogin',
        data: requsetData,
        method: 'post'
      })
      //因为token是企业微信号才能获取的，所以这里我们模拟了一个token号
      token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
      //将获取到的token值存入缓存
      wx.setStorageSync('token', token)
      //返回上一页面
      wx.navigateBack({
        delta:1
      })
    } catch (error) {
      console.log(error)
    }
  }
})