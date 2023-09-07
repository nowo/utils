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
    types(/abcd/); // "regex"
    types(new Date()); // "date"
 *
 */
export function types(o: any) {
    const s = Object.prototype.toString.call(o)
    const end = s.match(/\[object (.*?)\]/)?.[1].toLowerCase()
    return end as 'string' | 'object' | 'array' | 'number' | 'null' | 'undefined' | 'regex' | 'date' | undefined
}

/**
 * async / await 方法调用定时器(延迟执行)
 * @param {number} ms   暂停的时长（单位：毫秒）
 * @returns
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
 * JSON深度拷贝对象
 * @param  obj - 对象
 * @returns 拷贝的对象
 * @example
 * ```js
 * deepClone({ id: 1 })  // { id: 1 }
 * ```
 */
export function deepClone<T = any>(obj: T): T {
    return JSON.parse(JSON.stringify(obj))
}
