// pages/collection/collection.js
var util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    gids: ''
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
  removeCollection: function(e) {
    var that = this;
    var gid = e.currentTarget.dataset.id;
    console.log("gid = " + gid);
    wx.showModal({
      title: '提示',
      content: '您确定要取消收藏该商品吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定'); //此时需要将指定用户id的信息删除

          var ids = that.data.gids;
          console.log("删除前" + ids);
          for (var i in ids) {
            console.log(ids[i]);
            if (ids[i] == gid) {
              ids.splice(i, 1);
            }
          }
          console.log("删除后" + ids);
          that.setData({
            gids: ids
          });
          //保存到本地
          wx.setStorage({
            key: 'gids',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'gids',
      success: function(res) {
        that.setData({
          gids: res.data
        });
        wx.request({
          url: app.globalData.baseUrl + "goods/findGoodsByIds.action",
          data: {
            gids: that.data.gids.join(","),
            limit: 100
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
              if (goodsList.length == 0) {
                wx.showToast({
                  title: '查无数据',
                  icon: 'none',
                  duration: 2000,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
                return;
              }
              for (var i in goodsList) {
                var goods = goodsList[i];
                if (goods.picurl != null) {
                  var pi = goods.picurl.split(",");
                  goods.pics = app.globalData.picUrl + pi[0];
                }
                console.log(that.data.gids);
                for (var i in that.data.gids.length) {
                  console.log(that.data.gids[i] + "--------" + goods.gid);
                  if (that.data.gids[i] == goods.gid) {
                    that.setData({
                      isCollection: true
                    });
                    console.log("是否已经收藏过了--》" + that.data.isCollection)
                  }
                }
                that.data.phone = goods.phone;
                if (goods.headurl.indexOf("https") > -1) {
                  console.log("微信头像");
                } else {
                  goods.headurl = app.globalData.picUrl + goods.headurl;
                }
                goods.addTime = util.dateformat(parseInt(goods.addTime));
              }
              that.setData({
                goodsList: goodsList
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
      fail: function() {
        wx.showToast({
          title: '查无数据',
          icon: 'none',
          duration: 2000,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
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