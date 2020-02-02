var util = require('../../utils/util.js')
var app = getApp();
var inputinfo = "";
Page({
  data: {
    options: "",
    phone: "",
    goods: "",
    showModal: false,
    gids: [],
    isCollection: false,
    comments: []
  },
  isCJ: function(str) {
    if (str.indexOf("【出价】") > -1) {
      return true;
    }
    return false;
  },
  onPullDownRefresh: function() {
    // do somthing
    //  console.log("刷新了");
    this.onLoad(this.data.options);
  },
  addBlacklist: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要将用户【' + that.data.goods.nickname + '】加入黑名单吗？加入之后将看不到此用户的商品动态',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

          console.log("准备拉黑的用户：" + that.data.goods.uid);
          wx.getStorage({
            key: 'uids',
            success: function(res) {
              var uids = res.data;
              console.log("" + uids);
              var isExisted = false;
              for (var i in uids) {
                if (uids[i].uid == that.data.goods.uid) {
                  isExisted = true;
                }
              }
              if (!isExisted) { //不存在就保存
                console.log("不存在与黑名单，准备加入");
                var uidBean = {
                  uid: that.data.goods.uid,
                  nickname: that.data.goods.nickname,
                  headurl: that.data.goods.headurl
                };
                uids.push(uidBean); //保存没有拉黑过的用户id

                wx.setStorage({
                  key: 'uids',
                  data: uids
                })
                app.globalData.uids = uids; //同步更新app中的数据
              } else {
                console.log("已存在，不用再加入了");
              }
            },
            fail: function() {
              console.log("失败了，说明没有加入过黑名单，现在插入第一个");
              var uids = [];
              var uidBean = {
                uid: that.data.goods.uid,
                nickname: that.data.goods.nickname,
                headurl: that.data.goods.headurl
              };
              uids.push(uidBean); //保存没有拉黑过的用户id
              console.log('uids = ' + uids);
              wx.setStorage({
                key: 'uids',
                data: uids
              })
              console.log('uids = ' + uids);
              app.globalData.uids = uids; //同步更新app中的数据
            },
            complete: function() {
              wx.showToast({
                title: '成功拉黑',
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  getGids: function() {
    var that = this;
    wx.getStorage({
      key: 'gids',
      success: function(res) {
        that.setData({
          gids: res.data
        })
      },
    })
  },
  addCollection: function() {
    var that = this;
    var gids = that.data.gids;
    var isCollection = that.data.isCollection;
    console.log("点击前的状态：" + isCollection);

    if (isCollection) { //点之前是选中，删除收藏     
      for (var i in gids) {
        if (gids[i] == that.data.goods.gid) {
          gids.splice(i, 1);
        }
      }
    } else { //点之前是未选中，保存
      gids.push(that.data.goods.gid);
    }
    this.setData({
      isCollection: !isCollection
    });
    console.log("点击后的状态：" + that.data.isCollection);
    that.setData({
      gids: gids
    })
    wx.setStorage({
      key: 'gids',
      data: gids,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {
        wx.showToast({
          title: that.data.isCollection?'收藏成功':'取消收藏成功',
          duration: 2000
        })
      },
    });

  },
  addBrowCount: function(gid) {
    console.log("gid = " + gid);
    wx.request({
      url: app.globalData.baseUrl + 'goods/addBrowCount.action',
      data: {
        'gid': gid
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
  },
  input_content: function(e) {
    console.log("输入的内容为：" + e);
    inputinfo = e.detail.value;
  },
  /**
   * 弹窗
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {},
  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function() {
    this.hideModal();
    console.log("点击确定了" + inputinfo);
    console.log("comment:" + inputinfo);
    console.log("uid = " + app.globalData.accountInfo.uid);
    console.log("gid = " + this.data.options.gId);
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "comment/add.action",
      data: {
        gid: that.data.options.gId,
        uid: app.globalData.accountInfo.uid,
        content: inputinfo
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 2000
          })
          that.onLoad(that.data.options);
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
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
  },
  callPhone: function() {
    console.log("即将拨打电话：" + this.data.phone);
    wx.makePhoneCall({
      phoneNumber: this.data.phone // 仅为示例，并非真实的电话号码
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数http://115.29.148.100:8080/tzsc/GetGoodsDetailServlet
    this.setData({
      options: options
    });
    this.getGids();
    var gId = options.gId;
    this.addBrowCount(gId);
    console.log("id=========" + gId);
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "goods/findGoodsById.action?gid=" + gId,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 0) {
          var goods = res.data.data.goods;
          if (goods.picurl != null) {
            var url = [];
            var pi = goods.picurl.split(",");
            for (var i in pi) {
              url.push(app.globalData.picUrl + pi[i]);
            }
            goods.pics = url;
          }
          console.log(that.data.gids);
          for (var i in that.data.gids) {
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
          that.setData({
            goods: goods
          });
          // // 格式化时间、
          var commnets = res.data.data.comments;
          for (var i in commnets) {
            commnets[i].addTime = util.dateformat(parseInt(commnets[i].addTime));
            console.log
            if (commnets[i].headurl.indexOf("https") > -1) {
              console.log("微信头像");
            } else {
              commnets[i].headurl = app.globalData.picUrl + commnets[i].headurl;
            }

            commnets[i].isCJ = false;
            // 判断是否是出价
            if (commnets[i].content.indexOf("【出价】") > -1) {
              commnets[i].isCJ = true;
            }
          }
          that.setData({
            comments: res.data.data.comments
          });
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });
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