// 引入网络请求函数
import { request } from '../../request/index.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:'全部订单',
        isActive:true
      },{
        id:1,
        value:'待付款',
        isActive:false
      },{
        id:2,
        value:'待发货',
        isActive:false
      },{
        id:3,
        value:'退货/退款',
        isActive:false
      }
    ],
    orders:[]
  },
  onShow(){
    //判断是否有token
    // const token = wx.getStorageSync('token')
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index',
    //   })
    //   return
    // }
    //获取页面栈
    const pages = getCurrentPages()
    //获取传递到当前页面的参数
    const {type} = pages[pages.length-1].options
    //根据获取的参数打开相应的tab
    this.changeTabsItemByIndex(type-1)
    //根据type发送数据请求
    this.getOrders(type)
  },
  //获取订单数据
  async getOrders(type){
    const res = await request({url:'/my/orders/all',data:{type}})
    this.setData({
      orders:res.orders.map(v=>({
        ...v,
        time:new Date(v.create_time*1000).toLocaleString()
      }))
    })
  },
  //点击tab切换active
  handleTabsItemChange(e){
    const {index} = e.detail
    this.changeTabsItemByIndex(index)
    //手动切换tab时发送ajax请求。tab的index为0时，发送请求的type应该为1
    this.getOrders(index+1)
  },
  //根据index切换tab
  changeTabsItemByIndex(index){
    let tabs = this.data.tabs
    tabs.map((v,i) => v.id===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  }
})