function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 时间格式化工具
function dateformat(micro_second) {
  var date = new Date(micro_second);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() >=10 ? date.getDate() : "0" + date.getDate()) + ' ';
  var h = (date.getHours() >=10 ? date.getHours() : "0" + date.getHours()) + ':';
  var m = (date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()) + ':';
  var s = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
  // console.log(Y + M + D + h + m + s);
  return Y + M + D + h + m + s;
}
//时间格式化差值
function dateformat1(micro_second) {
  var date = new Date(micro_second);  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)+"月";
  var D = (date.getDate() > 10 ? date.getDate() : "0" + date.getDate()) + '日 ';
  var h = (date.getHours() > 10 ? date.getHours()  : "0" + date.getHours()) + ':';
  var m = (date.getMinutes() >9 ? date.getMinutes()  : "0" + date.getMinutes()) + ':';
  var s = date.getSeconds() > 10 ? date.getSeconds() : "0" + date.getSeconds();  
  // console.log(M + D + h + m + s);
  return  M+ D + h + m + s;
}
// 需要配置才能用方法哦
module.exports = {
  formatTime: formatTime,
  dateformat: dateformat,
  dateformat1: dateformat1
}

