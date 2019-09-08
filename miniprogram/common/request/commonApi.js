const zhihuApi = 'https://news-at.zhihu.com/api/3/news/latest';

function getRequest (url) {
  return new Promise(resolve => {
    wx.request({
      url: url,
      method: 'GET',
      success(res) {
        resolve(res);
      },
      fail(error) {
        console.info(error)
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
      },
      complete(res) {
      }
    })

  })
}

var zhihuApiGet = getRequest(zhihuApi);

exports.zhihuApiGet = zhihuApiGet;