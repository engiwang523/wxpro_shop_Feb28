var util = require('../../utils/util.js')
var app = getApp();
var page = 0;
Page({
  data: {
    adList: [],
    functionClass: [{
        "id": 'all',
        "icon": "/images/aj.png",
        "text": "Air Jordan"
      },
      {
        "id": 'last',
        "icon": "/images/yeezy.png",
        "text": "Yeezy"
      },
      {
        "id": 'hot',
        "icon": "/images/force.png",
        "text": "Air Force"
      },
      {
        "id": 'free',
        "icon": "/images/converse.png",
        "text": "Converse"
      }
    ],
    urgent: [],
    paiGoods: [],
    lastNew: []
  },
  toList: function(e, item) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/search/search?type=' + id,
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
  onPullDownRefresh: function() {
    console.log("下拉刷新了--->");
    page = 0;
    this.setData({
      lastNew: []
    });
    console.log("下拉刷新了当前值为：" + page);
    this.onLoad();
  },
  onReachBottom: function() {
    console.log("到达底部了，准备加载更多");
    this.getLastGoods();
  },
  lowmore: function() {
    console.log("到达底部了，准备加载更多");
    this.getLastGoods();
  },
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search?type=search',
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

  getLastGoods: function() {
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
    wx.request({
      url: app.globalData.baseUrl + 'goods/listLast.action',
      data: {
        'page': page,
        'limit': 20,
        'uids': ids
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
            lastNew: that.data.lastNew.concat(goods)
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
  onLoad: function(options) {
    // 页面显示
    console.log("用户信息为：" + app.globalData.accountInfo);
    //  console.log("类型"+app.globalData.goodsClass[0]);
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(app.globalData.baseUrl + '/advList.json');
    // 获取广告轮播
    wx.request({
      url: app.globalData.baseUrl + '/advList.json',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        // console.log(res.data.home_banner);
        // success
        that.setData({
          adList: res.data.home_banner
        });

        console.log(that.data.adList);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
    that.getLastGoods();
  },
  onReady: function() {
    // 页面渲染完成

  },
  onShow: function() {

  },
  onHide: function() {
    // 页面隐藏

  },
  onUnload: function() {
    // 页面关闭

  }
})