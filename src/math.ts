// // 引入 bignumber.js 库
// import BigNumber from 'bignumber.js'

// // 实现精准加法函数
// export function add(a: number, b: number) {
//     const num1 = new BigNumber(a)
//     const num2 = new BigNumber(b)

//     const sum = num1.plus(num2)
//     return sum.toString()
// }

/**
 * 实现精准加法函数（在数据不大的情况下，保证精度不丢失）
 * @param a {number} 相加数一
 * @param b {number} 相加数二
 * @returns number
 * @example
 * ```js
 * add(0.1, 0.2)    // 0.3
 *
 * ```
 */
export function add(a: number, b: number) {
    const [, aDecimal] = String(a).split('.')
    const [, bDecimal] = String(a).split('.')
    const precision = Math.max(aDecimal?.length || 0, bDecimal?.length || 0)
    const factor = 10 ** precision

    const result = (a * factor + b * factor) / factor
    return result
}
