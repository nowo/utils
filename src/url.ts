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

/**
 * 往 URL 上设置/合并 query 参数（保留原有参数与 hash，值为 null/undefined 则删除该键）
 * @param url 原始 URL 或路径（可含 query 与 hash）
 * @param params 要设置的键值对；数组展开为同名多项，null/undefined 删除对应键
 * @returns 新的 URL 字符串
 * @example
 * ```ts
 * setQueryParam('/p?a=1', { b: 2 })          // '/p?a=1&b=2'
 * setQueryParam('/p?a=1', { a: 2 })          // '/p?a=2'（覆盖）
 * setQueryParam('/p?a=1&b=2', { b: null })   // '/p?a=1'（删除）
 * setQueryParam('/p?a=1#top', { b: 2 })      // '/p?a=1&b=2#top'（保留 hash）
 * ```
 */
export function setQueryParam(url: string, params: Record<string, any>): string {
    const hashIndex = url.indexOf('#')
    const hash = hashIndex !== -1 ? url.slice(hashIndex) : ''
    const base = hashIndex !== -1 ? url.slice(0, hashIndex) : url
    const queryIndex = base.indexOf('?')
    const path = queryIndex !== -1 ? base.slice(0, queryIndex) : base
    const search = new URLSearchParams(queryIndex !== -1 ? base.slice(queryIndex + 1) : '')

    Object.entries(params).forEach(([key, value]) => {
        if (value == null) {
            search.delete(key)
        } else if (Array.isArray(value)) {
            search.delete(key)
            value.forEach(v => search.append(key, String(v)))
        } else {
            search.set(key, String(value))
        }
    })

    const qs = search.toString()
    return `${path}${qs ? `?${qs}` : ''}${hash}`
}
