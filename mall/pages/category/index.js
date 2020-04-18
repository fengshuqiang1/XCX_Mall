// 引入网络请求函数
import { request } from '../../request/index.js';
//引入兼容ES7的async写法的链接
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左边分类列表
    leftMenuList:[],
    // 右边内容数据
    rightContent:[],
    //当前被点击的tab
    currentIndex:0,
    //scroll-view滚动条的位置
    scrollTop:0
  },
  // 分类的所有数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取本地数据渲染页面
    const Cates = wx.getStorageSync('cates')
    //判断是否有数据
    if (!Cates) {
      //没有数据，发起数据请求
      this.getCates();
    }else{
      //有旧的数据，重新发起数据请求
      if (Date.now()-Cates.date>1000*10) {
        this.getCates();
      }else{
        //新缓存的数据继续使用
        this.Cates = Cates.data
        // 分离左边分类数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        //分离右边内容数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  async getCates(){
    // request({
    //   url:"/categories"
    // }).then(res => {
    //   this.Cates = res
    //   //将网络数据放在本地缓存中
    //   wx.setStorageSync('cates', {date:Date.now(), data:this.Cates})
    //   // 分离左边分类数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name)
    //   //分离右边内容数据
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    //使用es7来async和await来发送请求,下面这行没有请求到数据不会继续向下执行
    const res = await request({url:"/categories"})
    this.Cates = res
    //将网络数据放在本地缓存中
    wx.setStorageSync('cates', {date:Date.now(), data:this.Cates})
    // 分离左边分类数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    //分离右边内容数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左边点击事件函数
  handleItemTap(e){
    /**
     * 1.获取点击tab的索引
     * 2.根据索引重新获取右边内容数据
     * 3.修改currentIndex数据完成点击切换
     */
    const {index} = e.currentTarget.dataset
    const rightContent = this.Cates[index].children
    this.setData({
      currentIndex:index,
      rightContent,
      //将scroll-view组件的滚动条切换为0
      scrollTop:0
    })
  }
})