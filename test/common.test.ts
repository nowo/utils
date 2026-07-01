import { describe, expect, it, vi } from 'vitest'
import { debounce, deepClone, isEmpty, throttle, toThousands, types, wait } from '../src/common'
import { formatTime, timeAgo } from '../src/date'

describe('common', () => {
    it('types', () => {
        expect(types('')).toBe('string')
        expect(types({})).toBe('object')
        expect(types([])).toBe('array')
        expect(types(0)).toBe('number')
        expect(types(100)).toBe('number')
        expect(types(null)).toBe('null')
        expect(types(undefined)).toBe('undefined')
        expect(types()).toBe('undefined')
        expect(types(/abcd/)).toBe('regexp')
        expect(types(new Date())).toBe('date')
        expect(types(true)).toBe('boolean')
        expect(types(false)).toBe('boolean')
        expect(types(() => { })).toBe('function')
    })
    it('wait', async () => {
        const start = Date.now()
        const res = await wait(20)
        expect(res).toBe(20) // resolve 出传入的毫秒数
        expect(Date.now() - start).toBeGreaterThanOrEqual(15) // 确实有延迟
    })
    it('deepClone', () => {
        const source = { id: 1, nested: { list: [1, 2, 3] }, date: new Date('2023-01-01') }
        const cloned = deepClone(source)
        expect(cloned).toEqual(source) // 值相等
        expect(cloned).not.toBe(source) // 引用不同
        expect(cloned.nested).not.toBe(source.nested) // 深层引用也不同
        cloned.nested.list.push(4)
        expect(source.nested.list).toEqual([1, 2, 3]) // 改克隆不影响原数据
        expect(cloned.date).toBeInstanceOf(Date) // Date 被正确克隆
        expect(deepClone([{ a: 1 }])).toEqual([{ a: 1 }]) // 数组
    })
    it('isEmpty', () => {
        expect(isEmpty('')).toBe(true)
        expect(isEmpty(null)).toBe(true)
        expect(isEmpty(undefined)).toBe(true)
        expect(isEmpty([])).toBe(true)
        expect(isEmpty({})).toBe(true)
        expect(isEmpty(new Map())).toBe(true)
        expect(isEmpty(0)).toBe(false) // 0 不算空
        expect(isEmpty('a')).toBe(false)
        expect(isEmpty([1])).toBe(false)
        expect(isEmpty({ a: 1 })).toBe(false)
    })
    it('toThousands', () => {
        expect(toThousands(1234567)).toBe('1,234,567')
        expect(toThousands(1234567.89)).toBe('1,234,567.89')
        expect(toThousands(-1000)).toBe('-1,000')
        expect(toThousands('2000')).toBe('2,000')
        expect(toThousands('abc')).toBe('') // 非法输入
    })
    it('debounce', () => {
        vi.useFakeTimers()
        let count = 0
        const fn = debounce(() => count++, 100)
        fn()
        fn()
        fn()
        expect(count).toBe(0) // 还未触发
        vi.advanceTimersByTime(100)
        expect(count).toBe(1) // 多次触发只执行最后一次
        fn()
        fn.cancel()
        vi.advanceTimersByTime(100)
        expect(count).toBe(1) // cancel 后不再执行
        vi.useRealTimers()
    })
    it('throttle', () => {
        vi.useFakeTimers()
        let count = 0
        const fn = throttle(() => count++, 100)
        fn() // 首次立即执行
        fn() // 间隔内忽略
        expect(count).toBe(1)
        vi.advanceTimersByTime(100)
        fn() // 超过间隔再次执行
        expect(count).toBe(2)
        vi.useRealTimers()
    })
})

describe('date', () => {
    it('formatTime', () => {
        expect(formatTime()).toMatch(/^2026-/)
        expect(formatTime('2020/03/01 10:20:30')).toBe('2020-03-01 10:20:30')
        expect(formatTime(new Date('2023-09-09 '))).toMatch(/^2023-09-09/)

        expect(formatTime('2023-09-09 10:30:50', 'YYYY|mm|dd HH:MM:SS')).toBe('2023|09|09 10:30:50')
        expect(formatTime('2023/09/09 10:30:50', 'Y年m月d日 HH、MM/SS')).toBe('2023年9月9日 10、30/50')

        expect(formatTime('2023/09/09 10:30:50', '常用的时间格式为YYYY-mm-dd HH:MM:SS')).toBe('常用的时间格式为2023-09-09 10:30:50')

        // 1694253088667
        expect(formatTime(1694253088667)).toMatch(/^2023-09-09/)
        expect(formatTime(1694253088)).toMatch(/^2023-09-09/)
    })

    it('timeAgo', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2026-06-30 12:00:00'))
        expect(timeAgo(Date.now())).toBe('刚刚')
        expect(timeAgo(Date.now() - 60_000)).toBe('1分钟前')
        expect(timeAgo(Date.now() - 2 * 3600_000)).toBe('2小时前')
        expect(timeAgo(Date.now() - 3 * 86400_000)).toBe('3天前')
        vi.useRealTimers()
    })

    it('bar', () => {
        expect(1 + 1).eq(2)
    })

    it('snapshot', () => {
        expect({ foo: 'bar' }).toMatchSnapshot()
    })
})
