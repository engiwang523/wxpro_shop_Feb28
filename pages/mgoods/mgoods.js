// pages/mgoods/mgoods.js
var util = require('../../utils/util.js')
var app = getApp();
var page = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: []
  },
  lowmore: function() {
    console.log("到达底部了，准备加载更多");
    this.getGoodsList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = 0;
    this.setData({
      goodsList: []
    });
    this.getGoodsList();
  },
  getGoodsList: function() {
    page++;
    console.log("请求了--->" + page);
    var that = this;
    var uid = app.globalData.accountInfo.uid;
    wx.request({
      url: app.globalData.baseUrl + "goods/listByUid.action",
      data: {
        uid: uid,
        limit: 20,
        page: page
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          var goodsList = res.data.data;
          if (res.data.data.length == 0) {
            page--;
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          for (var i in goodsList) {
            var goods = goodsList[i];
            if (goods.picurl != null) {
              var pi = goods.picurl.split(",");
              goods.pics = app.globalData.picUrl + pi[0];
            }
            that.data.phone = goods.phone;
            if (goods.state == 0) {
              goods.stateMsg = "";
            } else if (goods.state == 1) {
              goods.stateMsg = "已下架"
            } else if (goods.state == 2) {
              goods.stateMsg = "已被管理员下架"
            }
            if (goods.headurl.indexOf("https") > -1) {
              console.log("微信头像");
            } else {
              goods.headurl = app.globalData.picUrl + goods.headurl;
            }
            goods.addTime = util.dateformat(parseInt(goods.addTime));
          }
          that.setData({
            goodsList: that.data.goodsList.concat(goodsList)
          });
        }
      },
      fail: function() {
        wx.showToast({
          title: '查无数据',
          icon: 'none',
          duration: 2000,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        // fail
      },
      complete: function() {
        // complete
      }
    });
  },
  toDetailPage: function(e) {
    var gId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?gId=' + gId,
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
  downGoods: function(e) {
    var that = this;
    var gid = e.currentTarget.dataset.id;
    console.log("gid = " + gid);
    wx.showModal({
      title: '您确定要下架该商品吗？',
      content: '下架之后商品将不会被其他人所看到',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          wx.request({
            url: app.globalData.baseUrl + 'goods/downGoodsSelf.action',
            data: {
              'gid': gid
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log(res.data);
              var goods = res.data.data;
              if (res.data.code == 0) {
                wx.showToast({
                  title: '成功下架',
                  icon: 'success',
                  duration: 2000
                })
                that.onLoad();
              } else {
                wx.showToast({
                  title: '下架失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          });

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
  onShow: function() {},

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
    page = 0;
    this.setData({
      goodsList: []
    });
    this.onLoad();
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