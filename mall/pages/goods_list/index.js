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
        value:'综合',
        isActive:true
      },{
        id:1,
        value:'销量',
        isActive:false
      },{
        id:2,
        value:'价格',
        isActive:false
      }
    ],
    goodsList:[]
  },
  //用于请求数据的参数的属性
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  //初始化获取数据的总页数
  totalPage:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.QueryParams.cid = options.cid ||''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },
  async getGoodsList(){
    const res =await request({url:'/goods/search',data:this.QueryParams})
    //获取总页数
    this.totalPage = Math.ceil(res.total/this.QueryParams.pagesize)
    //数据累加，使用es6的语法更加简单
    // let goodsList = this.data.goodsList.concat(res.goods)
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 下拉刷新，立刻回弹
    wx.stopPullDownRefresh()
  },
  //上拉页面触底
  onReachBottom(){
    if (this.QueryParams.pagenum>=this.totalPage) {
      wx.showToast({
        title: '没有一下页了',
      })
    }else{
      this.getGoodsList()
      this.QueryParams.pagenum++
    }
  },
  //下拉刷新
  onPullDownRefresh(){
    // 重置商品数据
    this.setData({
      goodsList:[]
    })
    // 重置当前页码
    this.QueryParams.pagenum=1
    // 发送请求
    this.getGoodsList()
  },
  //点击tab切换active
  handleTabsItemChange(e){
    const {index} = e.detail
    let tabs = this.data.tabs
    tabs.map((v,i) => v.id===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  }
})