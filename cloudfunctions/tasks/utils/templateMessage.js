const rp = require('request-promise');

/**
 * 发送模版消息
 * ：小程序模板消息接口将于2020年1月10日下线，开发者可使用订阅消息功能
 * @param {*} token 
 * @param {*} messageData 
 */
const sendTemplateMsg = async (token, messageData) => {
  const {templateId, formId, page, data, OPENID} = messageData;
  await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + token,
    body: {
      touser: OPENID,
      template_id: templateId,
      page: page,
      form_id: formId,
      data: data
    }
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}

/**
 * 发送订阅消息
 * @param {*} token 
 * @param {*} messageData 
 */
const sendSubscribeMsg = async (token, messageData) => {
  const {templateId, page, data, OPENID} = messageData;
  await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token,
    body: {
      touser: OPENID,
      template_id: templateId,
      page: page,
      data: data
    }
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
}
module.exports = {
  sendTemplateMsg: sendTemplateMsg,
  sendSubscribeMsg: sendSubscribeMsg
}