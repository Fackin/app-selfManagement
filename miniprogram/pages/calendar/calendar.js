const canlendar = require("../../utils/calendar");

Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    theDay: '',
    setEvent: false,
    isChecked: 0,
    lunar:0,
    strokes: {
      strokeName: '',
      mark: ''
    }
  },
  onLoad: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
      setEvent: false
    })
  },
  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = [];                       //需要遍历的日历数组数据
    let arrLen = 0;                         //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth();                 //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year, (month + 1), 1).getDay();                          //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate();               //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        let lunar = canlendar.solar2lunar(year, month+1, num);
        let lDay = lunar.IDayCn;
        if (lDay == '初一') lDay = lunar.IMonthCn;
        obj = {
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
          weight: 5,
          lDay: lDay
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  /**
   * 设置
   */
  setDayEvent: function (e) {
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let day = e.currentTarget.dataset.datenum;
    if (!!day) {
      let isChecked = '' + year + month + day;
      day = day > 9 ? day : '0' + day;
      let theDay = year + '-' + month + '-' + day;
      let lunar = canlendar.solar2lunar(year, month, day)
      this.setData({
        lunar: lunar,
        isChecked: isChecked,
        theDay: theDay,
        setEvent: true,
      })
    }
  },
  /**
   * 模板消息
   * @param {event} e 
   */
  submitTemplateMessageForm(e) {
    this.setData({
      templateMessageResult: '',
    })
    
    console.log(e.detail)
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendTemplateMessage',
        templateId: 'GIDPSiz4SPxicWF2HPntcL7WNCojj7NM9uETuTaZ158',
        // OPENID: wx.cloud.getWXContext(),
        formId: e.detail.formId,
        page: 'pages/openapi/openapi',
        data: {
          keyword1: {
            value: '未名咖啡屋',
          },
          keyword2: {
            value: '2019 年 1 月 1 日',
          },
          keyword3: {
            value: '拿铁',
          },
        }
      },
      success: res => {
        console.warn('[云函数] [openapi] templateMessage.send 调用成功：', res)
        wx.showModal({
          title: '发送成功',
          content: '请返回微信主界面查看',
          showCancel: false,
        })
        wx.showToast({
          title: '发送成功，请返回微信主界面查看',
        })
        this.setData({
          templateMessageResult: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] templateMessage.send 调用失败：', err)
      }
    })
  },
  /**
   * 订阅消息
   * @param {event} e 
   */
  submitSubscribeMessageForm(e) {
    console.log('submitSubscribeMessageForm')
    wx.requestSubscribeMessage({
      tmplIds: ['VkZ9h-lyNOqtysm6zC0uZGYl1itJiniEs_TxRqyRsWo'],
      success (res) {

        console.log(res)
        wx.cloud.callFunction({
          name: 'openapi',
          data: {
            action: 'sendSubscribeMessage',
            templateId: 'VkZ9h-lyNOqtysm6zC0uZGYl1itJiniEs_TxRqyRsWo',
            // OPENID: wx.cloud.getWXContext(),
            page: 'pages/calendar/calendar',
            data: {
              thing1: {
                value: '安排',
              },
              time2: {
                value: '2019年10月1日 15:01',
              },
              thing4: {
                value: '拿铁',
              },
            }
          },
          success: res => {
            console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
            wx.showModal({
              title: '发送成功',
              content: '请返回微信主界面查看',
              showCancel: false,
            })
            wx.showToast({
              title: '发送成功，请返回微信主界面查看',
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '调用失败',
            })
            console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
          }
        })
        
      }
    })
  },
  /**
   * 提交行程
   */
  submitMessageForm: function(e) {
    console.log(e.detail.value)
    let data = e.detail.value;
    const db = wx.cloud.database()
    let strokeTime = new Date(this.data.theDay);
    console.log(strokeTime);
    if (!data.strokeName) {
      wx.showToast({
        title: '必填',
        icon: 'none'
      })
      return;
    }
    db.collection('strokes').add({
      data: {
        strokeName: data.strokeName,
        strokeTime: strokeTime,
        mark: data.mark
      },
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
    db.collection('tasks').add({
      data: {
        taskType: '1',
        execTime: strokeTime,
        taskName: data.strokeName,
        taskMark: data.mark,
        formId: e.detail.formId
      },
      success: res => {
      },
      fail: err => {
      }
    })
  },
  // 订阅消息（定时发送） 提交信息
  submitMessageForm2: function(e) {
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['VkZ9h-lyNOqtysm6zC0uZGYl1itJiniEs_TxRqyRsWo'],
      success (res) {

        console.log(that.data.strokes)
        let data = that.data.strokes;
        const db = wx.cloud.database()
        let strokeTime = new Date(that.data.theDay);
        console.log(strokeTime);
        if (!data.strokeName) {
          wx.showToast({
            title: '必填',
            icon: 'none'
          })
          return;
        }
        db.collection('strokes').add({
          data: {
            strokeName: data.strokeName,
            strokeTime: strokeTime,
            mark: data.mark
          },
          success: res => {
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
        db.collection('tasks').add({
          data: {
            taskType: '2',
            execTime: strokeTime,
            taskName: data.strokeName,
            taskMark: data.mark
          },
          success: res => {
          },
          fail: err => {
          }
        })

      }
    });
  },


  // 非form表单 填信息赋值
  getValue: function(e) {
    this.data.strokes[e.currentTarget.dataset.type] = e.detail.value;
    this.setData({
      strokes: this.data.strokes
    });
  },
})