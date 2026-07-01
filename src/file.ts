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
 * 获取文件扩展名（小写，不含点；无扩展名返回 ''）
 * @param  {string} fileName - 文件名（可带查询参数，如 `a.PNG?v=1`）
 * @returns 扩展名，如 `png`；无后缀返回 ''
 * @example
 * ```ts
 * getFileExt('a.PNG')      // 'png'
 * getFileExt('a.tar.gz')   // 'gz'
 * getFileExt('a.png?v=1')  // 'png'
 * getFileExt('README')     // ''
 * ```
 */
export function getFileExt(fileName: string): string {
    const name = fileName?.split('?')[0] ?? ''
    if (!name.includes('.')) return ''
    return name.split('.').at(-1)?.toLowerCase() || ''
}

const DATA_URL_RE = /^data:([^;]*);base64,/

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

/**
 * 浏览器端触发文件下载
 * @param source Blob 对象，或已有的文件 URL/dataURL
 * @param filename 保存的文件名（同源 URL 生效；跨域链接浏览器可能忽略）
 * @example
 * ```ts
 * downloadFile(blob, 'report.xlsx')
 * downloadFile('https://a.com/f.pdf', 'f.pdf')
 * ```
 */
export function downloadFile(source: Blob | string, filename = ''): void {
    const a = document.createElement('a')
    a.download = filename
    const isBlob = typeof source !== 'string'
    const url = isBlob ? URL.createObjectURL(source) : source
    a.href = url
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (isBlob) URL.revokeObjectURL(url)
}

/**
 * Blob 转 base64 dataURL（浏览器与 Node 均可用）
 * @param blob Blob 对象
 * @returns 形如 `data:<mime>;base64,xxxx` 的 dataURL
 * @example
 * ```ts
 * const dataURL = await blobToBase64(blob)
 * img.src = dataURL
 * ```
 */
export async function blobToBase64(blob: Blob): Promise<string> {
    const bytes = new Uint8Array(await blob.arrayBuffer())
    let binary = ''
    for (const byte of bytes) binary += String.fromCharCode(byte)
    const base64 = btoa(binary)
    return `data:${blob.type || 'application/octet-stream'};base64,${base64}`
}

/**
 * base64 转 Blob（接收 dataURL 或纯 base64 串，浏览器与 Node 均可用）
 * @param base64 dataURL（`data:...;base64,xxx`）或纯 base64 字符串
 * @param type 手动指定 MIME 类型；传入 dataURL 时默认沿用其自带类型
 * @returns Blob 对象
 * @example
 * ```ts
 * base64ToBlob('data:text/plain;base64,aGk=')      // Blob { type: 'text/plain' }
 * base64ToBlob('aGk=', 'text/plain')               // Blob { type: 'text/plain' }
 * ```
 */
export function base64ToBlob(base64: string, type = ''): Blob {
    let data = base64
    let mime = type
    const match = base64.match(DATA_URL_RE)
    if (match) {
        if (!mime) mime = match[1]
        data = base64.slice(match[0].length)
    }
    const binary = atob(data)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return new Blob([bytes], { type: mime })
}
