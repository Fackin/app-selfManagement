// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    default: {
      return
    }
  }
}
/**
 * 云端测试与定时触发暂时都不支持使用云调用
 * 
 * @param {*} event 
 */
async function sendTemplateMessage(event) {
  try {
    const {templateId, formId, page, data, OPENID} = event;
    const sendResult = await cloud.openapi.templateMessage.send({
      touser: OPENID,
      templateId,
      formId: formId,
      page: page,
      data: data
    })
    return sendResult
  } catch (error) {
    console.error(error)
    const {templateId, formId, page, data, OPENID} = event;
    console.log(templateId, formId, page, data, OPENID);
  }
}
/**
 * 发送订阅消息
 * @param {*} event 
 */
async function sendSubscribeMessage(event) {
  const { OPENID } = cloud.getWXContext()
  // const templateId = 'VkZ9h-lyNOqtysm6zC0uZGYl1itJiniEs_TxRqyRsWo';
  const {templateId, page, data} = event;

  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    templateId,
    page: page,
    data: data
  })
  return sendResult
}

async function getWXACode(event) {

  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/openapi/openapi',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}

async function getOpenData(event) {
  // 需 wx-server-sdk >= 0.5.0
  return cloud.getOpenData({
    list: event.openData.list,
  })
}
