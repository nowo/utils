const toStringTagRE = /\[object (.*?)\]/
const UUID_TEMPLATE_RE = /[xy]/g
const DEFAULT_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

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
    return new Promise<number>(resolve => setTimeout(resolve, ms, ms))
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
    } catch (_err) {
        try {
            newObj = Array.isArray(data) ? [] : {}
        } catch (_error) {
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
 * 深比较两个值是否相等（递归对比，支持对象/数组/Date/RegExp/Map/Set）
 * @param a 值 A
 * @param b 值 B
 * @returns boolean
 * @example
 * ```ts
 * deepEqual({ a: 1, b: [1, 2] }, { a: 1, b: [1, 2] }) // true
 * deepEqual([1, { x: 1 }], [1, { x: 2 }])             // false
 * deepEqual(Number.NaN, Number.NaN)                   // true
 * ```
 */
export function deepEqual(a: any, b: any): boolean {
    if (Object.is(a, b)) return true
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
    if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString()
    // 类型不同直接判否（如数组 vs 普通对象、Map vs 对象）
    if (a.constructor !== b.constructor) return false

    if (a instanceof Map) {
        if (a.size !== b.size) return false
        for (const [key, value] of a) {
            if (!b.has(key) || !deepEqual(value, b.get(key))) return false
        }
        return true
    }
    if (a instanceof Set) {
        if (a.size !== b.size) return false
        for (const value of a) {
            if (!b.has(value)) return false
        }
        return true
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every(key => Object.hasOwn(b, key) && deepEqual(a[key], b[key]))
}

/**
 * 生成标准 UUID v4（优先原生 `crypto.randomUUID`，不支持时回退手动实现）
 * @returns 形如 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` 的 36 位字符串
 * @example
 * ```ts
 * getUuid() // 'a1b2c3d4-...-e5f6...'
 * ```
 */
export function getUuid(): string {
    const c = globalThis.crypto
    if (c?.randomUUID) return c.randomUUID()
    // 回退：手动按 v4 规则拼接（version 位固定 4，variant 位取 8/9/a/b）
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(UUID_TEMPLATE_RE, (ch) => {
        const r = Math.floor(Math.random() * 16)
        const v = ch === 'x' ? r : 8 + (r % 4)
        return v.toString(16)
    })
}

/**
 * 生成指定长度的随机字符串 ID（类 nanoid，优先使用 `crypto` 保证随机质量）
 * @param length 长度，默认 8
 * @param chars 可选字母表，默认大小写字母 + 数字
 * @returns 随机 ID
 * @example
 * ```ts
 * getRandomId()             // 'aZ3kPq7X'（8 位）
 * getRandomId(12)           // 12 位
 * getRandomId(6, '0123456789') // 纯数字 6 位验证码
 * ```
 */
export function getRandomId(length = 8, chars = DEFAULT_ID_CHARS): string {
    let result = ''
    const c = globalThis.crypto
    if (c?.getRandomValues) {
        const bytes = c.getRandomValues(new Uint8Array(length))
        for (let i = 0; i < length; i++) result += chars[bytes[i] % chars.length]
    } else {
        for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
}

let uniqueIdCounter = 0

/**
 * 生成进程内自增唯一 ID（用于列表 key、临时 DOM id 等，重启后从头计数）
 * @param prefix 可选前缀
 * @returns `${prefix}${自增数字}`
 * @example
 * ```ts
 * getUniqueId()      // '1'
 * getUniqueId('row_') // 'row_2'
 * ```
 */
export function getUniqueId(prefix = ''): string {
    uniqueIdCounter += 1
    return `${prefix}${uniqueIdCounter}`
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
