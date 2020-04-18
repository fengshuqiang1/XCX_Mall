// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    //商品收藏的数量
    collectNum:0
  },
  onShow(){
    //获取用户信息
    const userinfo = wx.getStorageSync('userinfo')
    // 获取商品收藏缓存
    const collect = wx.getStorageSync('collect')||[]

    this.setData({
      userinfo,
      collectNum:collect.length
    })
  }
})