const toStringTagRE = /\[object (.*?)\]/

/**
 * @function 判断数据类型
 * @param {any} o 对应的数据
 * @example
 *  types("") // "string"
    types({}); // "object"
    types([]); // "array"
    types(100); // "number"
    types(null); // "null"
    types(); // "undefined"
    types(/abcd/); // "regexp"
    types(new Date()); // "date"
 *
 */
export function types(o?: any) {
    const s = Object.prototype.toString.call(o)
    const end = s.match(toStringTagRE)?.[1].toLowerCase()
    return end as 'string' | 'object' | 'array' | 'number' | 'null' | 'undefined' | 'regexp' | 'date' | undefined
}

/**
 * async / await 方法调用定时器(延迟执行)
 * @param {number} ms   暂停的时长（单位：毫秒）
 * @returns promise
 * @example
 * ```js
 * await wait(1000);
 * console.log('aaa');  // 1秒之后打印 aaa
 * ```
 */
export function wait(ms: number) {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
}

/**
 * 数据深拷贝方法
 * @param  data -  原数据
 * @returns 拷贝后的新数据
 * @example
 * ```js
 * deepClone({ id: 1 })  // { id: 1 }
 * ```
 */
export const deepClone = <T = any>(data: T): T => {
    let newObj: any
    // 先使用原生自带的深拷贝，出错了就使用自己自定义的方法
    try {
        newObj = structuredClone(data)
    } catch (err) {
        try {
            newObj = Array.isArray(data) ? [] : {}
        } catch (error) {
            newObj = {}
        }
        for (const attr in data) {
            if (data[attr] && typeof data[attr] === 'object') {
                newObj[attr] = deepClone(data[attr])
            } else {
                newObj[attr] = data[attr]
            }
        }
    }
    return newObj
}

/**
 * 判断文件类型，返回所属分类名；无法识别（含无后缀）返回 'other'
 * @param  {string} fileName - 文件名（可带查询参数，如 `a.png?v=1`）
 * @returns 分类名：image / txt / excel / word / pdf / video / audio / zip / other
 * @example
 * ```js
 * getFileType(`132546.png`)  // 'image'
 * getFileType(`a.mp3`)       // 'audio'
 * getFileType(`README`)      // 'other'
 * ```
 */
export function getFileType(fileName: string) {
    const listData = {
        image: ['png', 'jpg', 'jpeg', 'bmp', 'gif'], // 可以将符合该分类的后缀都写入数组里
        txt: ['txt'], // 匹配txt
        excel: ['xls', 'xlsx'], // 匹配 excel
        word: ['doc', 'docx'], // 匹配 word
        pdf: ['pdf'], // 匹配 pdf
        video: ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'], // 匹配 视频
        audio: ['mp3', 'wav', 'wma'], // 匹配 音频（wma 为音频，wmv 属视频）
        zip: ['zip', 'rar', 'gz'], // 匹配 压缩包
    }
    // 后缀获取（去掉查询参数后取最后一段），对空值/非法输入做兜底
    const suffix = fileName?.split('?')[0]?.split('.').at(-1)?.toLocaleLowerCase() || ''
    if (!suffix) return 'other' // 无后缀或无法识别

    for (const i in listData) {
        const key = i as keyof typeof listData
        if (Object.hasOwn(listData, key) && listData[key].includes(suffix)) return key
    }
    return 'other'
}

/**
 * URL地址路径拼接
 * @param {string[]} arg - 需要拼接的字符串数组
 * @returns {string} 拼接后的路径字符串
 * @example
 * ```js
 * pathJoin('a', 'b', 'c')  // 'a/b/c'
 * ```
 */
export const pathJoin = (...arg: string[]) => {
    const arr: string[] = []
    arg.forEach((item, index) => {
        // 去除空格左右两边空格,为空不添加
        item = item?.trim?.()
        if (!item) return
        // 去除开头的斜杠，（第一个不处理）
        if (item.startsWith('/') && index) item = item.slice(1)
        // 去除结尾的斜杠
        if (item.endsWith('/')) item = item.slice(0, -1)
        arr.push(item)
    })
    return arr.join('/')
}

/**
 * 防抖：在最后一次触发后等待 wait 毫秒再执行，高频触发只生效最后一次
 * @param fn 需要防抖的函数
 * @param wait 等待毫秒数，默认 300
 * @param immediate 是否在第一次触发时立即执行，默认 false
 * @returns 包装后的函数，带 `cancel()` 取消尚未执行的调用
 * @example
 * ```ts
 * const onInput = debounce(() => search(), 500)
 * onInput()
 * onInput.cancel() // 取消未执行的调用
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300, immediate = false) {
    let timer: ReturnType<typeof setTimeout> | null = null
    function debounced(this: any, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer)
        if (immediate && !timer) fn.apply(this, args)
        timer = setTimeout(() => {
            timer = null
            if (!immediate) fn.apply(this, args)
        }, wait)
    }
    debounced.cancel = () => {
        if (timer) clearTimeout(timer)
        timer = null
    }
    return debounced
}

/**
 * 节流：每 wait 毫秒最多执行一次（首次立即执行）
 * @param fn 需要节流的函数
 * @param wait 间隔毫秒数，默认 300
 * @returns 包装后的函数
 * @example
 * ```ts
 * const onScroll = throttle(() => log(), 200)
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait = 300) {
    let last = 0
    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now()
        if (now - last >= wait) {
            last = now
            fn.apply(this, args)
        }
    }
}

/**
 * 判断值是否为空：null / undefined / '' / 空数组 / 空 Map|Set / 无自身可枚举属性的对象
 * @param value 任意值
 * @returns boolean（注意 `0`、`false` 不算空）
 * @example
 * ```ts
 * isEmpty('')   // true
 * isEmpty([])   // true
 * isEmpty({})   // true
 * isEmpty(0)    // false
 * ```
 */
export function isEmpty(value: any): boolean {
    if (value == null) return true
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
    if (value instanceof Map || value instanceof Set) return value.size === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}

/**
 * 数字千分位格式化
 * @param num 数字或可转为数字的字符串
 * @returns 千分位字符串；非法输入返回 ''
 * @example
 * ```ts
 * toThousands(1234567)     // '1,234,567'
 * toThousands(1234567.89)  // '1,234,567.89'
 * toThousands(-1000)       // '-1,000'
 * ```
 */
export function toThousands(num: number | string): string {
    const n = typeof num === 'string' ? Number(num) : num
    if (typeof n !== 'number' || Number.isNaN(n)) return ''
    return n.toLocaleString('en-US', { maximumFractionDigits: 20 })
}

/**
 * 解析 query 字符串为对象（自动 decode，重复键取最后一个）
 * @param str query 串或完整 URL（自动截取 `?` 之后、`#` 之前的部分）
 * @returns 键值对象
 * @example
 * ```ts
 * parseQuery('?a=1&b=hello%20world') // { a: '1', b: 'hello world' }
 * parseQuery('https://a.com/p?id=2') // { id: '2' }
 * ```
 */
export function parseQuery(str: string): Record<string, string> {
    let query = str.includes('?') ? str.slice(str.indexOf('?') + 1) : str
    const hashIndex = query.indexOf('#')
    if (hashIndex !== -1) query = query.slice(0, hashIndex)

    const result: Record<string, string> = {}
    new URLSearchParams(query).forEach((value, key) => {
        result[key] = value
    })
    return result
}

/**
 * 对象转 query 字符串（自动 encode，跳过 null/undefined，数组展开为同名多项）
 * @param obj 键值对象
 * @returns query 串（不含开头的 `?`）
 * @example
 * ```ts
 * stringifyQuery({ a: 1, b: 'x', c: null }) // 'a=1&b=x'
 * stringifyQuery({ id: [1, 2] })            // 'id=1&id=2'
 * ```
 */
export function stringifyQuery(obj: Record<string, any>): string {
    const params = new URLSearchParams()
    Object.entries(obj).forEach(([key, value]) => {
        if (value == null) return
        if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)))
        } else {
            params.append(key, String(value))
        }
    })
    return params.toString()
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

/**
 * 字节数转可读大小
 * @param bytes 字节数
 * @param decimals 保留小数位，默认 2
 * @returns 形如 `1.5 KB`；非法或负数返回 ''
 * @example
 * ```ts
 * formatBytes(0)       // '0B'
 * formatBytes(1536)    // '1.5KB'
 * formatBytes(1234567) // '1.18MB'
 * ```
 */
export function formatBytes(bytes: number, decimals = 2): string {
    if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) return ''
    if (bytes === 0) return '0B'
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), BYTE_UNITS.length - 1)
    const value = Number.parseFloat((bytes / 1024 ** i).toFixed(decimals))
    return `${value}${BYTE_UNITS[i]}`
}
