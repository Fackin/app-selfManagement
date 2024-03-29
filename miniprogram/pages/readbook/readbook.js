// pages/readbook/readbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onQuery();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 新增笔记
   */
  addBook: function () {
    wx.navigateTo({
      url: '/pages/addbook/addbook',
    })
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('bookreading').where({
      _openid: this.data.openid,
      // bookName: '111'
    }).get({
      success: res => {
        console.log(JSON.stringify(res.data, null, 2))
        this.setData({
          booklist: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
})