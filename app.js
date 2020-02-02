//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
      },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    uids:[],
    userInfo: null,
    accountInfo:null,
    // baseUrl:"http://152.136.129.19:8080/api/",
    // picUrl: "http://152.136.129.19:8080/",
    // baseUrl: "https://www.hdxyzb.cn/api/",
    // picUrl: "https://www.hdxyzb.cn/"
    baseUrl: "http://192.168.75.1:8080/api/",
    picUrl: "http://192.168.75.1:8080/"
  }
})