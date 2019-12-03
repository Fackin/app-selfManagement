const cloud = require('wx-server-sdk');
const templateMessage = require('./templateMessage.js');
const filter = require('./dateFormat.js');

const COLL_FIELD_NAME = 'publicField';
const FIELD_NAME = 'ACCESS_TOKEN';

// 模板消息-行动计划
const TEMPLATEID = 'GIDPSiz4SPxicWF2HPntcL7WNCojj7NM9uETuTaZ158';
// 订阅消息-预约计划
const SUBSCRIBEID = 'VkZ9h-lyNOqtysm6zC0uZGYl1itJiniEs_TxRqyRsWo';

cloud.init();
const db = cloud.database();

/**
 * 模板消息-行动计划
 * @param {OBject} task 
 */
const sendTMsg = async task => {
  //
  let tokenRes = await db.collection(COLL_FIELD_NAME).doc(FIELD_NAME).get();
  let token = tokenRes.data.token;

  let messageData = {
    templateId: TEMPLATEID,
    OPENID: task._openid,
    formId: task.formId,
    page: 'pages/calendar/calendar',
    data: {
      keyword1: {
        value: task.taskName,
      },
      keyword2: {
        value: filter.dateFormat(task.execTime, 'yyyy-MM-dd hh:mm:ss'),
      },
      keyword3: {
        value: task.taskMark,
      },
    }
  }
  // 小程序模板消息接口将于2020年1月10日下线，开发者可使用订阅消息功能
  await templateMessage.sendTemplateMsg(token, messageData);
}

/**
 * 订阅消息-预约计划
 * @param {Object} task 
 */
const sendSMsg = async task => {
  //
  let tokenRes = await db.collection(COLL_FIELD_NAME).doc(FIELD_NAME).get();
  let token = tokenRes.data.token;

  let messageData = {
    templateId: SUBSCRIBEID,
    OPENID: task._openid,
    page: 'pages/calendar/calendar',
    data: {
      thing1: {
        value: task.taskName,
      },
      time2: {
        value: filter.dateFormat(task.execTime, 'yyyy年MM月dd日 hh:mm'),
      },
      thing4: {
        value: task.taskMark,
      },
    }
  }
  //
  await templateMessage.sendSubscribeMsg(token, messageData);
}

module.exports = {
  sendTMsg: sendTMsg,
  sendSMsg: sendSMsg
}