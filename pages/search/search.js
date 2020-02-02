// pages/search/search.js
var util = require('../../utils/util.js')
var app = getApp();
var page = 0;
var inputinfo = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    options: '',
    type: ''
  },
  content: function(e) {
    console.log("输入的内容为：" + e);
    inputinfo = e.detail.value;
  },
  onSearch: function() {
    page = 0;
    this.setData({
      goodsList: []
    });
    this.getGoodsList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var title = "商品搜索";
    switch (options.type) {
      case 'search':
        title = "商品搜索";
        break;
      case 'all':
        title = "Air Jordan";
        break;
      case 'last':
        title = "Yeezy";
        break;
      case 'hot':
        title = "Air Force";
        break;
      case 'free':
        title = "Converse";
        break;
    }
    wx.setNavigationBarTitle({
      title: title //页面标题为路由参数
    })
    this.setData({
      options: options
    });
    page = 0;
    inputinfo = '';
    this.setData({
      godosList: []
    });
    this.getGoodsList();
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
    console.log("下拉刷新了--->");
    page = 0;
    this.setData({
      godosList: []
    });
    console.log("下拉刷新了当前值为：" + page);
    this.refresh();
  },
  getGoodsList: function() {
    var that = this;
    // console.log("黑名单用户" + app.globalData.uids.uid.join(","));
    var ids = '';
    for (var i in app.globalData.uids) {
      console.log("用户id = " + app.globalData.uids[i].uid);
      if (i == app.globalData.uids.length - 1) { //最后一个不需要加逗号
        ids += app.globalData.uids[i].uid;
      } else {
        ids += app.globalData.uids[i].uid + ",";
      }

    }
    console.log("uids = " + ids);
    page++;
    console.log("开始获取了-->" + page);
    // 获取最新发布的商品
    var requestApi = '';
    console.log(this.options.type);
    switch (this.options.type) {
      case 'search':
      case 'all':
      case 'last':
        requestApi = 'goods/listLast.action';
        break;
      case 'hot':
        requestApi = 'goods/listHot.action';
        break;
      case 'free':
        requestApi = 'goods/listFree.action';
        break;
    }
    wx.request({
      url: app.globalData.baseUrl + requestApi,
      data: {
        'page': page,
        'limit': 20,
        'uids': ids,
        'key': inputinfo
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        var goods = res.data.data;
        if (res.data.code == 0) {
          if (res.data.data.length == 0) {
            page--;
            wx.showToast({
              title: '没有更多了',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          // console.log("商品列表为：" + goods);
          for (var i in goods) {
            // console.log("时间为：" + util.dateformat(parseInt(goods[i].addTime)));
            goods[i].addTime = util.dateformat(parseInt(goods[i].addTime));
            if (goods[i].headurl.indexOf("https") > -1) {
              // console.log("微信图片");
            } else {
              goods[i].headurl = app.globalData.picUrl + goods[i].headurl;
            }

            if (goods[i].picurl != null) {
              goods[i].pic = app.globalData.picUrl + goods[i].picurl.split(",")[0];
            }
            // console.log(goods[i].headurl);
          }
          that.setData({
            goodsList: that.data.goodsList.concat(goods)
          });
          // console.log("当前商品列表：" + that.data.lastNew);
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
        wx.stopPullDownRefresh();
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getGoodsList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})