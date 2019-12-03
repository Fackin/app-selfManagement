/**
 * 日期时间格式转化
 * @param  {*} date 时间格式或时间戳
 * @param  {String} fmt 显示格式 如：'yyyy-MM-dd hh:mm:ss'
 * 
 * @example
 * // return '2019-11-07 15:56:40'
 * dateFormat(1573113400000, 'yyyy-MM-dd hh:mm:ss')
 */
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

module.exports = dateFormat;
