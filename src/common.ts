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
    const end = s.match(/\[object (.*?)\]/)?.[1].toLowerCase()
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
 * 判断文件类型
 * @param  {string} fileName - 对象
 * @returns string
 * @example
 * ```js
 * getFileType(`132546.png`)  // 'image'
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
        radio: ['mp3', 'wav', 'wmv'], // 匹配 音频
        zip: ['zip', 'rar', 'gz'], // 匹配 压缩包
    }
    // 后缀获取
    let suffix = ''
    // 获取类型结果
    let result: keyof typeof listData | '' = ''
    try {
        const arr = fileName.split('?')
        const fileArr = arr[0].split('.')// 根据.分割数组
        suffix = fileArr[fileArr.length - 1]// 取最后一个
    } catch (err) { // 如果fileName为空等.split方法会报错，就走下面的逻辑
        suffix = ''
    } // fileName无后缀返回 false
    if (!suffix) { // 走catch后返回false
        return false
    }

    suffix = suffix.toLocaleLowerCase()// 将后缀所有字母改为小写方便操作
    /*  这里开始写入需要判断的逻辑体  */
    for (const i in listData) {
        const key = i as keyof typeof listData
        if (Object.prototype.hasOwnProperty.call(listData, key)) {
            const element = listData[key]
            if (element.includes(suffix)) {
                result = key
            }
        }
    }

    return result || 'other'
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
