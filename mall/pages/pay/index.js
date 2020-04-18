import {requestPayment,showToast} from '../../utils/asyncWx.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
// 引入网络请求函数
import {request} from '../../request/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressData:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  //因为购物车页面应该是被经常切换，所以我们没切换一次就要更新一次。所以使用onShow生命周期函数
  onShow: function () {
    // 获取被选商品数据
    let cart = wx.getStorageSync('cart')||[]
    // 筛选出被选中的商品
    cart = cart.filter(value => value.checked)
    // 获取收货地址数据
    const addressData = wx.getStorageSync('address')
    //改变需要支付商品的总价、总数量
    this.setCart(cart)
    // 更新收货地址和购物车列表数据
    this.setData({
      addressData
    })
  },
  // 结算，跳转到支付页面
  async handlePay(){
    // 获取地址信息和选购商品数量
    const {addressData,totalNum} = this.data
    // 判断是否添加收货地址
    if (!addressData) {
      await showToast({title:'你还没有添加地址'})
      return
    }
    // 判断是否选购商品
    if (totalNum===0) {
      await showToast({title:'你还没有选购商品'})
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  },
  // 根据购物车列表数据的改变，改变全选状态、总价、总数量
  setCart(cart){
    // 计算总价格和总数量
    let totalPrice = 0
    let totalNum=0
    cart.forEach(v=>{
        totalPrice += v.num*v.goods_price
        totalNum += v.num
    })
    this.setData({
      totalNum,
      totalPrice,
      cart
    })
  },
  //点击进行支付
  async handleOrderPay(){
    try{
      // 先获取支付需要的token值
      const token = wx.getStorageSync('token')
      // 判断是否存在token
      if (!token) {
        //跳转到微信授权页面
        wx.navigateTo({
          url: '/pages/auth/index'
        })
      }
      // console.log('已经存在token')
      //1 创建订单
      //获取请求体参数列表
      const order_price = this.data.totalPrice
      //整理地址
      const address = this.data.addressData.provinceName+this.data.addressData.cityName+this.data.addressData.countyName+this.data.addressData.detailInfo
      const consignee_addr = address
      let goods = []
      //获取购物车信息
      const cart = wx.getStorageSync('cart')
      cart.forEach(value=>goods.push({
        goods_id:value.goods_id,
        goods_number:value.num,
        goods_price:value.goods_price
      }))
      //整理请求数据
      const requestData = {order_price,consignee_addr,goods}
      //开始发送请求 创建订单
      const {order_number} = await request({url:"/my/orders/create",data:requestData,method:'POST'})
      //2 预支付请求
      const {pay} =await request({
        url:"/my/orders/req_unifiedorder",
        data:{order_number},
        method:'POST'
      })
      //3 发起微信支付,这里我不是企业账号没有权限发起微信支付！
      await requestPayment(pay)
      // 4 查询订单 获取订单状态
      const res = await request({url:"/my/orders/chkOrder",data:{order_number},method:'POST'})
      console.log(res)
      //5 显示支付成功提示
      await showToast({title:'支付成功'})
      //支付成功之后手动删除已支付的购物车中的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v=>!v.checked)
      wx.setStorageSync('cart', newCart)
      //6 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      })
    }catch(err){
      console.log(err)
    }
  }
})