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
