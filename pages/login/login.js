//index.js
//获取应用实例
const app = getApp()
var inputinfo;
var openid;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    console.log("进入主页了");
    wx.switchTab({
      url: '/pages/index/index'
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
    var that = this;
    console.log("点击确定了" + inputinfo);
    console.log(inputinfo.length);
    if (inputinfo.length != 11) {
      wx.showToast({
        title: '手机号必须为11位',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.hideModal();
      console.log("手机号位数合法");
      console.log("phone = " + inputinfo);
      console.log("nickname = " + app.globalData.userInfo.nickName);
      console.log("sex = " + app.globalData.userInfo.gender);
      console.log("headurl = " + app.globalData.userInfo.avatarUrl);
      console.log("openid = " + openid);
      wx.request({
        //后台接口地址
        url: app.globalData.baseUrl + 'account/wxRegister.action',
        data: {
          phone: inputinfo,
          nickname: app.globalData.userInfo.nickName,
          sex: app.globalData.userInfo.gender,
          headurl: app.globalData.userInfo.avatarUrl,
          openid: openid
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          wx.hideLoading();
          console.log(res.data);
          if (res.data.code == 0) {
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            })
            app.globalData.accountInfo = res.data.data;
            console.log("登录成功，保存用户信息，进入主页");
            wx.switchTab({
              url: '/pages/index/index'
            });
          } else if (res.data.code == 10001014) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            that.showDialogBtn();
          } else {
            wx.showModal({
              title: res.data.msg,
              confirmText: 'OK',
              showCancel: false
            })
            console.log("用户信息注册失败");
          }
        }
      })
    }

  },
  onLoad: function() {    
    wx.getStorage({
      key: 'uids',
      success: function(res) {
       app.globalData.uids=res.data;
        console.log("黑名单用户" + app.globalData.uids);
      }
    });
    console.log("黑名单用户"+app.globalData.uids);
    console.log("获取用户信息了");
    if (app.globalData.userInfo) {
      console.log("有用户信息");
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      console.log("可以获取用户信息");
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log("开始获取用户信息了");
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log("用户信息" + res.userInfo);
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  login: function() {
    var that = this;
    wx.showLoading({
      title: '登录中',
    })
    console.log("开始获取用户的openid了");
    wx.login({
      success: function(res) {
        console.log("code=" + res.code)
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function(res_user) {
              wx.request({
                //后台接口地址
                url: app.globalData.baseUrl + 'account/getWxOpenId.action',
                data: {
                  code: res.code
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json'
                },
                success: function(res) {
                  wx.hideLoading();
                  console.log(res.data);
                  if (res.data.code == 0) {
                    wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                      duration: 2000
                    })
                    console.log(res.data.data);
                    app.globalData.accountInfo = res.data.data;
                    console.log("登录成功，保存用户信息，进入主页");
                    wx.switchTab({
                      url: '/pages/index/index'
                    });
                  } else if (res.data.code == 10001018) {
                    openid = res.data.data;
                    wx.showModal({
                      title: '检测到您是第一次登录系统，需要输入手机号',
                      confirmText: 'OK',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          that.showDialogBtn();
                        }
                      }
                    })
                  } else {
                    wx.showModal({
                      title: '登录失败，请稍后再试',
                      confirmText: 'OK',
                      showCancel: false
                    })
                    console.log("用户信息获取失败");
                  }
                }
              })
            },
            fail: function() {},
            complete: function(res) {}
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //获取用户详细信息了
    this.login();
    // console.log("开始进入主页了");
    // wx.switchTab({
    //   url: '/pages/index/index'
    // });
  }
})