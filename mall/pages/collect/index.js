// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:'商品收藏',
        isActive:true
      },{
        id:1,
        value:'品牌收藏',
        isActive:false
      },{
        id:2,
        value:'店铺收藏',
        isActive:false
      },{
        id:3,
        value:'浏览足迹',
        isActive:false
      }
    ],
    // 收藏商品数据
    collectData:[]
  },
  onShow(){
    const collect = wx.getStorageSync('collect')
    this.setData({
      collectData:collect
    })
  },
  //点击tab切换active
  handleTabsItemChange(e){
    const {index} = e.detail
    this.changeTabsItemByIndex(index)
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