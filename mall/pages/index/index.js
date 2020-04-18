// 引入网络请求函数
import { request } from '../../request/index.js';
Page({
  data:{
    // 轮播图数据
    swiperList:[],
    // 导航数据
    catesList:[],
    // 获取楼层数据
    floorList:[]
  },
  onLoad:function(options){
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图图片
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(result => {
      this.setData({
        swiperList:result
      })
    })
  },
  // 获取导航数据
  getCateList(){
    request({
      url:"/home/catitems"
    }).then(result => {
      this.setData({
        catesList:result
      })
    })
  },
  // 获取楼层数据
  getFloorList(){
    request({
      url:"/home/floordata"
    }).then(result => {
      this.setData({
        floorList:result
      })
    })
  }
})