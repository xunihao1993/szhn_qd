// @ts-ignore
/* eslint-disable */
/* 通用方法 */
import { request } from 'umi';
import moment from 'moment';


/**给定日期区间 返回相距月数
 * 例如[2022-02-01, 2022-02-22] 相隔0.8月返回1个月 小于0.7月返回0个月
 *
*/
export function get_month_num_format(dateList:any) {
  moment.defaultFormat = 'YYYY-MM-DD';
  var values = 0;
  if (dateList && dateList[0] && dateList[1]) {
    const data_flag = moment(dateList[1], moment.defaultFormat).diff(
      moment(dateList[0], moment.defaultFormat),
      'months',
    ); // 不带小数点
    const data_flag2 = moment(dateList[1], moment.defaultFormat).diff(
      moment(dateList[0], moment.defaultFormat),
      'months',
      true,
    ); // 带小数点
    console.log('data_flag:', data_flag);
    console.log('data_flag2:', data_flag2);
    if (data_flag2 >= data_flag + 0.8) {
      // 向上取整
      return ( Math.ceil(data_flag2));
    } else {
      return (data_flag);
    }
  } else {
    return values;
  }
}

export function changeToChinese (data:string) {
  // var data = data
  // if ( typeof data == "number"){
  //    data = data.toString()
  // }
  const a = data.split('.')//分割
  const b = a[0].split(',')//分割整数
  if (a.length === 1)a.push('')
  let combin = ''//整数定义
  b.forEach(ite => combin += ite)//合并整数
  const Aword = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const Bword = ['角', '分']
  const Cword = ['', '拾', '佰', '仟']
  const Dword = ['', '万', '亿']
  const Eword = ['零', '元', '整']
  let returnWords = ''//返回值
  if (combin.length > 12) {
    console.error('超出限制')
    return ''
  }
  //整数部分拼接
  if (parseInt(combin) > 0) {
    let t = 0
    for (let i = 0; i < combin.length; i++) {
      const currentSite = combin.length - i - 1 //当前在第几位
      const currentData = combin.slice(i, i + 1)//当前元素
      const bigUnit = currentSite / 4 //4位一组单位选取 万|亿
      const smallUnit = currentSite % 4 //4位一组的位置 拾|佰|仟
      if (currentData === '0') { //是否为0
        t++
      } else {
        if (t > 0) {
          returnWords += Aword[0]//前面有0补零
        }
        t = 0//重置
        returnWords += Aword[parseInt(currentData)] + Cword[smallUnit]
      }
      if (smallUnit === 0 && t < 4) {
        returnWords += Dword[bigUnit]
        t = 0//重置
      }
    }
    returnWords += Eword[1]
  }
  //小数部分拼接
  //小数部分为全为0时
  if (a[1] === '00' || a[1] === '') {
    //金额为0时
    if (returnWords === '') {
      returnWords = Eword[0] + Eword[1] + Eword[2]
    } else {
      returnWords += Eword[2]
    }
    return returnWords
  } else {
    for (let i = 0; i < a[1].length; i++) {
      const currentData = a[1].slice(i, i + 1)//当前元素
      if (currentData !== '0') {
        returnWords += Aword[parseInt(currentData)] + Bword[i]
      } else if (i === 0) {
        returnWords += Aword[parseInt(currentData)]
      }
    }
  }
  return returnWords
}
