// pages/blacklist/blacklist.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uids: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      uids: app.globalData.uids
    });
    console.log("--->" + this.data.uids);
    if (this.data.uids.length == 0) {
      wx.showToast({
        title: '没有黑名单',
        icon: 'none',
        duration: 2000
      })
    }
  },
  removeBlacklist: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.id);
    var uid = e.currentTarget.dataset.id;

    wx.showModal({
      title: '提示',
      content: '您确定要该用户移出黑名单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定'); //此时需要将指定用户id的信息删除

          var ids = app.globalData.uids;
          for (var i in ids) {
            if (ids[i].uid == uid) {
              ids.splice(i, 1);
            }
          }
          app.globalData.uids = ids; //更新app
          //保存到本地
          wx.setStorage({
            key: 'uids',
            data: ids
          })
          wx.showToast({
            title: '成功移出',
            icon: 'success',
            duration: 2000
          })
          that.onLoad();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})