// 引入网络请求函数
import { request } from '../../request/index.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // input是否有焦点
    isFocus:false,
    // 输入框内容
    inputValue:''
  },
  // 声明一个变量用于存储setTimeout
  timer:-1,
  // 输入触发搜索事件
  handleSearch(e){
    // 获取输入框的值
    const value = e.detail.value
    // 获取焦点和设置输入框内容
    this.setData({
      isFocus:true,
      inputValue:value
    })
    // 检验输入的内容是不是空白符
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    clearTimeout(this.timer)
    // 发送网络请求
    this.timer = setTimeout(() => {
      this.querySearch(value)
    }, 1000)
  },
  // 发起网络请求
  async querySearch(query){
      const {goods} = await request({url:'/goods/search',data:{query}})
      this.setData({goods})
  },
  // 点击按钮隐藏按钮清空输入框和搜索结果
  handleHiddenButton(){
    // 重置输入框、焦点和搜索结果
    this.setData({
      goods:[],
      isFocus:false,
      inputValue:''
    })
  }
})