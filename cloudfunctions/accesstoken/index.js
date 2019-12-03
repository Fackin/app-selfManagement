const cloud = require('wx-server-sdk');
const rq = require('request-promise');
const APPID = 'wx606277bb074c7878';
const APPSECRET = 'afe2e69aad4740e0ede6489dbf3fb1dc';
const COLLNAME = 'publicField';
const FIELDNAME = 'ACCESS_TOKEN';

cloud.init();

const db = cloud.database();

exports.main = async(event, context) => {
  try {
    let res = await rq({
      method: 'GET',
      uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET,
    });
    res = JSON.parse(res);

    let resUpdate = await db.collection(COLLNAME).doc(FIELDNAME).update({
      data: {
        token: res.access_token
      }
    })
  } catch (e) {
    console.error(e);
  }
}