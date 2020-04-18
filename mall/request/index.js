// 记录同时发送数据请求的次数
let ajaxCount = 0;
export const request = params => {
  //如果需要传递其他的请求头信息
  let header = {...params.header}
  //判断是否需要加请求头，缓存中有token时才会有请求头
  if (params.url.includes("/my/")) {
    header["Authorization"] = wx.getStorageSync('token')
  }
  //开始显示正在加载
  wx.showLoading({
    title: '正在加载中...',
    mask:true
  })
  //增加同时进行数据请求的次数
  ajaxCount++
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      header,
      url:baseUrl + params.url,
      success: (result)=>{
        resolve(result.data.message)
      },
      fail: (err)=>{
        reject(err)
      },
      complete:()=>{
        //没完成一次数据请求就减少正在数据请求的数量
        ajaxCount--
        //所用的ajax请求都完成了才隐藏正在加载提示
        if (ajaxCount===0) {
          wx.hideLoading()
        }
      }
    });
  })
}