const cloud = require('wx-server-sdk');
// const dateFormat = require('../utils/dateFormat')
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const execTasks = []; // 待执行任务栈
  // 1.查询是否有定时任务。（timeingTask)集合是否有数据。
  let taskRes = await db.collection('tasks').limit(100).get()
  let tasks = taskRes.data;
  // 2.定时任务是否到达触发时间。只触发一次。
  let now = new Date();
  try {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].execTime <= now) { // 时间到
        execTasks.push(tasks[i]); // 存入待执行任务栈
        // 定时任务数据库中删除该任务
        await db.collection('tasks').doc(tasks[i]._id).remove()
      }
    }
  } catch (e) {
    console.error(e)
  }
  // 3.处理待执行任务
  for (let i = 0; i < execTasks.length; i++) {
    let task = execTasks[i];
    if (task.taskType == 1) { // 定时开奖任务
      const tsakExec = require('./utils/taskExec');
      try {
        await tsakExec.sendTMsg(task);
        // 云端测试与定时触发暂时都不支持使用云调用
        // await cloud.callFunction({
        //   // 要调用的云函数名称
        //   name: 'openapi',
        //   // 传递给云函数的参数
        //   data: {
        //     action: 'sendTemplateMessage',
        //     templateId: 'GIDPSiz4SPxicWF2HPntcL7WNCojj7NM9uETuTaZ158',
        //     OPENID: task._openid,
        //     formId: task.formId,
        //     page: 'pages/calendar/calendar',
        //     data: {
        //       keyword1: {
        //         value: task.taskName,
        //       },
        //       keyword2: {
        //         value: dateFormat(task.execTime, 'yyyy-MM-dd hh:mm:ss'),
        //       },
        //       keyword3: {
        //         value: task.taskMark,
        //       },
        //     }
        //   }
        // })
      } catch(e) {
        console.error(e)
      }
    } else if (task.taskType == 2) {
      const tsakExec = require('./utils/taskExec');
      try {
        await tsakExec.sendSMsg(task);
        // 云端测试与定时触发暂时都不支持使用云调用，订阅消息可以了？？
        // await cloud.callFunction({
        //   // 要调用的云函数名称
        //   name: 'openapi',
        //   // 传递给云函数的参数
        //   data: {
        //     action: 'sendSubscribeMessage',
        //     templateId: 'VkZ9h-lyNOqtysm6zC0uZGYl1itJiniEs_TxRqyRsWo',
        //     OPENID: task._openid,
        //     page: 'pages/calendar/calendar',
        //     data: {
        //       thing1: {
        //         value: task.taskName,
        //       },
        //       time2: {
        //         value: dateFormat(task.execTime, 'yyyy年MM月dd日 hh:mm'),
        //       },
        //       thing4: {
        //         value: task.taskMark,
        //       },
        //     }
        //   }
        // })
      } catch (error) {
        console.log(error);
      }
    }
  }
}

function dateFormat(date, fmt) {
  if (!date) return;
  date = date.constructor === Date ? date : new Date(Number(date));
  let o = {
    'y+': date.getFullYear(), // 年
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分钟
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S+': date.getMilliseconds() // 毫秒
  };
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      if (k === 'y+') {
        fmt = fmt.replace(RegExp.$1, String(o[k]).substr(4 - RegExp.$1.length));
      } else if (k === 'S+') {
        let lens = RegExp.$1.length;
        lens = lens === 1 ? 3 : lens;
        fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(String(o[k]).length - 1, lens));
      } else {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
      }
    }
  }
  return fmt;
}
