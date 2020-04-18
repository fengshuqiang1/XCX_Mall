import {getSetting,openSetting,chooseAddress,showModal,showToast} from '../../utils/asyncWx.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressData:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  //因为购物车页面应该是被经常切换，所以我们没切换一次就要更新一次。所以使用onShow生命周期函数
  onShow: function () {
    // 获取被选商品数据
    let cart = wx.getStorageSync('cart')||[]
    // 获取收货地址数据
    const addressData = wx.getStorageSync('address')
    //改变全选状态。选择的总价、总数量
    this.setCart(cart)
    // 更新收货地址和购物车列表数据
    this.setData({
      addressData
    })
  },
  //点击添加收货地址
  async handleChooseAddress(){
    //try-catch用于捕获错误
    try {
      // 1.获取当前获取收货地址的权限
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 2.判断当前获取收货地址的权限
      if (scopeAddress === false) {
        //3.打开设置权限的页面
        await openSetting()
      }
      //4.获取收货地址
      const address = await chooseAddress()
      console.log(address)
      // 5.将收货地址存在缓存中
      wx.setStorageSync('address', address)
    } catch (error) {
      console.log(error)
    }
  },
  //购物车商品列表单选
  handleItemChange(e){
    // 1 获取点击单选的商品ID
    const goods_id = e.currentTarget.dataset.id
    //2 获取被点击单选商品的数据对象并改变它的选中状态
    let cart = wx.getStorageSync('cart')
    const index = cart.findIndex(v=>v.goods_id===goods_id)
    cart[index].checked = !cart[index].checked
    //3 改变cart缓存
    wx.setStorageSync('cart', cart)
    //4 改变全选、总价、总选择数量
    this.setCart(cart)
  },
  // 购物车全选按钮功能实现
  handleAllChange(){
    //修改全选状态的改变
    this.setData({
      allChecked:!this.data.allChecked
    })
    // 其他所有选择商品选择状态改变
    let cart = wx.getStorageSync('cart')
    // 其他选择状态跟随全选状态
      cart.forEach(v=>{
        v.checked = this.data.allChecked
      })
    // 改变缓存和data数据
    wx.setStorageSync('cart', cart)
    this.setCart(cart)
  },
  // 加减购物车商品功能
  async handleNumChange(e){
    const {id,operation} = e.currentTarget.dataset
    // 获取所有购物车列表数据
    let cart = this.data.cart
    //找到当前修改数量的商品
    const index = cart.findIndex(value=>value.goods_id===id)
    //判断是否要删除商品
    if (cart[index].num===1&&operation===-1) {
      const res = await showModal({content:'确定要删除该商品？'})
      if (res.confirm) {
        //删除当前商品
        cart.splice(index,1)
        //修改data数据和缓存
        wx.setStorageSync('cart', cart)
        this.setCart(cart)
      }else if(res.cancel){
        console.log('用户点击了取消')
      }
    }else{
      cart[index].num += operation
      //更新data数据和缓存数据
      wx.setStorageSync('cart', cart)
      this.setCart(cart)
    }
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
    // 根据购物车被选商品数据计算全选,注意空数组进行真假判断时为真
    const allChecked = cart.length?cart.every(v=>v.checked):false
    // 计算总价格和总数量
    let totalPrice = 0
    let totalNum=0
    cart.forEach(v=>{
      if (v.checked) {
        totalPrice += v.num*v.goods_price
        totalNum += v.num
      }
    })
    this.setData({
      allChecked,
      totalNum,
      totalPrice,
      cart
    })
  }
})