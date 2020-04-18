// 引入网络请求函数
import { request } from '../../request/index.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:{},
    isCollect:false
  },
  //用于保存当前商品详情的数据，且后面添加购物车需要添加数量
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 根据页面栈拿通过路由传递过来的参数
    const pages = getCurrentPages()
    const {options} = pages[pages.length-1]
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },
  async getGoodsDetail(goods_id){
    const goodsDetail = await request({url:'/goods/detail',data:{goods_id}})
    this.GoodsInfo = goodsDetail
    //获取到数据之后再判断当前商品是否被收藏！
    //获取收藏商品数据
    let collect = wx.getStorageSync('collect') || []
    //初始化当前商品被收藏的状态
    let isCollect = false
    //判断当前商品是否被收藏
    isCollect = collect.some(v=>v.goods_id===goodsDetail.goods_id)
    this.setData({
      goodsDetail:{
        goods_id:goodsDetail.goods_id,
        goods_name:goodsDetail.goods_name,
        goods_price:goodsDetail.goods_price,
        //将所有的webp格式换成jpg格式
        goods_introduce:goodsDetail.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsDetail.pics
      },
      isCollect
    })
    
  },
  //点击预览大图
  handlePreviewImage(e){
    const current = e.currentTarget.dataset.currentUrl
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    wx.previewImage({
      //当前点击图片的URL
      current,
      //所有图片的URL
      urls
    })
  },
  //点击添加商品到购物车
  handleCartAdd(){
    // 1.获取购物车缓存
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断当前商品是否在购物车中
    const index = cart.findIndex(v => this.GoodsInfo.goods_id===v.goods_id)
    if (index === -1) {
      // 3.index为-1时说明当前商品不再购物车中，那么添加该商品
      // 为商品详情数据添加一个num为购物车购买数量
      this.GoodsInfo.num = 1
      // 为商品详情添加属性checked，表示在购物车中是否选中
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    }else{
      // 4.如果存在购物车中，那么添加数量
      cart[index].num++
    }
    //5.最后将改变的购物车缓存储存
    wx.setStorageSync('cart', cart)
    //6.添加提示
    wx.showToast({
      title: '加入购物车成功',
      mask:true,
      icon:"success"
    })
  },
  // 实现点击收藏功能
  handleCollect(){
    //获取收藏缓存
    let collect = wx.getStorageSync('collect') || []
    //初始化当前商品收藏状态
    let isCollect = false
    //判断当前商品的收藏状态
    if (this.data.isCollect) {
      //当前收藏状态为true，获取当前商品在缓存中的位置
      const index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
      // 在收藏商品缓存中删除当前商品
      collect.splice(index,1)
      //改变当前商品的状态
      isCollect = false
    }else{
      //当判断状态为false时，将当前商品添加到收藏缓存中
      collect.push(this.GoodsInfo)
      isCollect = true
    }
    //最后设置缓存和data数据
    wx.setStorageSync('collect', collect)
    this.setData({
      isCollect
    })
  }
})