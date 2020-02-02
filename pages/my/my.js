var app = getApp();
Page({
  data: {
    headurl: "",
    nickname: ""
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数

    if (app.globalData.accountInfo.headurl.indexOf("https") > -1) {
      console.log("微信头像");
      this.setData({
        headurl: app.globalData.accountInfo.headurl
      });
    } else {
      this.setData({
        headurl: app.globalData.picUrl + app.globalData.accountInfo.headurl
      });
    }
    console.log("--<>" + app.globalData.accountInfo.nickname);
    this.setData({
      nickname: app.globalData.accountInfo.nickname + "(" + (app.globalData.accountInfo.sex ? "男" : "女") + ")"
    });
    console.log("--<>" + this.data.nickname);


  },
  toOrder:function(){
    wx.navigateTo({
      url: '/pages/order/order',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  toCollection: function() {
    wx.navigateTo({
      url: '/pages/collection/collection',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  toAddress: function() {
    wx.navigateTo({
      url: '/pages/address/address',
      success: function(res) {
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onReady: function() {
    // 页面渲染完成

  },
  onShow: function() {
    // 页面显示

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  }
})