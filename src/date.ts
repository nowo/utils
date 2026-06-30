import { types } from './common'

/**
 * @description 时间戳转化为年 月 日 时 分 秒
 * @method formatTime(format,num)
 * @param {number|Date} [num] 时间戳或者时间对象,默认使用当前时间戳, new Date().getTime(); 获取当前时间戳（毫秒）
 * @param {string} [format] 时间格式,不填时默认使用'YYYY-mm-dd HH:MM:SS'格式,更改只需替换中间连接符号就行'YYYY年mm月dd日 HH时MM分SS秒'
 * @example
 *  var timestamp = 1472048779952; //js一般获取的时间戳是13位，PHP一般是10位
    formatTime(timestamp,'YYYY-mm-dd HH:MM:SS') // 2016-08-24 22:26:19
 */
export function formatTime(num: number | string | Date = Date.now(), format = '') {
    format = format || 'YYYY-mm-dd HH:MM:SS' // 第一个参数不填时，使用默认格式
    let ret, date: Date, reNum

    if (types(num) === 'number') {
        // 处理时间戳，js一般获取的时间戳是13位，PHP一般是10位,根据实际情况做判断处理
        if (num.toString().length === 10) {
            date = new Date((num as number) * 1000)
        } else {
            date = new Date(num)
        }
    } else if (types(num) === 'string') {
        date = new Date(num)
    } else if (types(num) === 'date') {
        date = num as Date
    } else {
        return ''
    }

    const opt = {
        Y: date.getFullYear().toString(), // 年
        m: (date.getMonth() + 1).toString(), // 月
        d: date.getDate().toString(), // 日
        H: date.getHours().toString(), // 时
        M: date.getMinutes().toString(), // 分
        S: date.getSeconds().toString(), // 秒
    // 目前用的是这六种符号,有其他格式化字符需求可以继续添加，值必须转化成字符串
    }
    let k: keyof typeof opt
    for (k in opt) {
        ret = new RegExp(`(${k}+)`).exec(format)
        if (ret) {
            reNum = ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0') // 根据复数前面是否补零,如“mm”补零，单“m”前面不补零
            format = format.replace(ret[1], reNum) // 替换
        }
    }
    return format
}

/**
 * 相对时间：转为「刚刚 / x分钟前 / x小时前 / x天前 / x个月前 / x年前」
 * @param time 时间戳(10 位秒 / 13 位毫秒) / 时间字符串 / Date，默认当前时间
 * @returns 相对时间描述；非法输入返回 ''
 * @example
 * ```ts
 * timeAgo(Date.now() - 60_000) // '1分钟前'
 * ```
 */
export function timeAgo(time: number | string | Date = Date.now()): string {
    let date: Date
    if (types(time) === 'number') {
        const num = time as number
        date = new Date(num.toString().length === 10 ? num * 1000 : num)
    } else if (types(time) === 'string') {
        date = new Date(time as string)
    } else {
        date = time as Date
    }

    const diff = Date.now() - date.getTime()
    if (Number.isNaN(diff)) return ''

    const sec = Math.floor(diff / 1000)
    if (sec < 60) return '刚刚'
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}分钟前`
    const hour = Math.floor(min / 60)
    if (hour < 24) return `${hour}小时前`
    const day = Math.floor(hour / 24)
    if (day < 30) return `${day}天前`
    const month = Math.floor(day / 30)
    if (month < 12) return `${month}个月前`
    return `${Math.floor(month / 12)}年前`
}
