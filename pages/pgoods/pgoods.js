var app = getApp();
Page({
  data: {
    img_url: [],
    index: 0,
    classifyResult: '',
    classify: [],
    content: '',
    title: '',
    price: 0,
    oldPrice: 0,
    address: ''
  },
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '获取分类信息中...',
    })
    wx.request({
      url: app.globalData.baseUrl + 'classify/list.action',
      data: {
        limit: 50
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log("---->" + res.data);
        console.log("---->" + res.data.data);
        var classify = [];
        var result = res.data.data;
        for (var i in result) {
          classify.push(result[i].name);
        }
        that.setData({
          classifyResult: res.data.data,
          classify: classify
        });
        wx.hideLoading()
      },
      fail: function(res) {
        wx.hideLoading()
        console.log('获取失败')
      }
    })
  },
  content: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  title: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  price: function(e) {
    this.setData({
      price: e.detail.value
    })
  },
  oldPrice: function(e) {
    this.setData({
      oldPrice: e.detail.value
    })
  },
  address: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  chooseimage: function() {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) {

        if (res.tempFilePaths.length > 0) {

          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }

          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })

        }

      }
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    console.log("此时选中的分类名字为：" + this.data.classifyResult[this.data.index].name);
    console.log("此时选中的分类id为：" + this.data.classifyResult[this.data.index].cid);
  },
  //发布按钮事件
  send: function() {
    var that = this;

    if (that.data.title == '') {
      wx.showModal({
        title: '请输入商品标题',
        confirmText: 'OK',
        showCancel: false
      });
    } else if (that.data.content == '') {
      wx.showModal({
        title: '请输入商品描述',
        confirmText: 'OK',
        showCancel: false
      });
    } else if (that.data.img_url.length == 0) {
      wx.showModal({
        title: '请选择商品图片',
        confirmText: 'OK',
        showCancel: false
      });
    } else if (that.data.address == '') {
      wx.showModal({
        title: '请输入商品地址',
        confirmText: 'OK',
        showCancel: false
      });
    } else {
      console.log("输入的标题为：" + that.data.title);
      console.log("输入的内容为：" + that.data.content);
      console.log("输入的价格为：" + that.data.price);
      console.log("输入的原价为：" + that.data.oldPrice);
      console.log("输入的地址为：" + that.data.address);
      console.log("输入的分类为：" + that.data.classify[that.data.index]);
      // var user_id = wx.getStorageSync('userid')
      wx.showLoading({
        title: '发布中...',
      })
      that.img_upload()
    }
  },
  //图片上传
  img_upload: function() {
    let that = this;
    let img_url = that.data.img_url;
    let img_url_ok = [];
    //由于图片只能一张一张地上传，所以用循环
    for (let i = 0; i < img_url.length; i++) {
      wx.uploadFile({
        //路径填你上传图片方法的地址
        url: app.globalData.baseUrl + 'wxUploadPic.action',
        filePath: img_url[i],
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: function(res) {
          var result = JSON.parse(res.data);
          console.log('上传成功' + result);
          console.log('上传成功' + result.code);
          console.log('上传成功' + result.msg);
          console.log('上传成功-->url = ' + result.data);
          //把上传成功的图片的地址放入数组中
          img_url_ok.push(result.data)
          console.log("当前列表：" + img_url_ok);
          //如果全部传完，则可以将图片路径保存到数据库
          if (img_url_ok.length == img_url.length) {
            console.log("字符串拼接：" + img_url_ok.join(","));
            console.log("图片上传完成，准备提交参数" + img_url_ok);
            wx.request({
              url: app.globalData.baseUrl + 'goods/add.action',
              data: {
                title: that.data.title,
                uid: app.globalData.accountInfo.uid,
                images: img_url_ok,
                content: that.data.content,
                price: that.data.price,
                oldPrice: that.data.oldPrice,
                publishType: 0, //0表示新品，2表示免费
                pinkage: true, //默认包邮
                address: that.data.address,
                cid: that.data.classifyResult[that.data.index].cid, //暂时写死
                lat: 39.26, //由于获取经纬度需要设置一个按钮要用户授权了才能得到，为了提高用户体验这里采用写死的方法
                lng: 115.25, //写死为北京
                picurl: img_url_ok.join(","),
                province: '北京' //此字段由服务端根据经纬度获取
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                console.log("---->" + res.data);
                wx.hideLoading()
                if (res.data.code == 0) {
                  wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.showToast({
                    title: res.data.res,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        },
        fail: function(res) {
          wx.hideLoading()
          console.log('上传失败')
        }
      })
    }
  }
})