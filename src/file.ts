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

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']

/**
 * 字节数转可读大小
 * @param bytes 字节数
 * @param decimals 保留小数位，默认 2
 * @returns 形如 `1.5KB`；非法或负数返回 ''
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
