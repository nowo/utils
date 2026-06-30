import { describe, expect, it } from 'vitest'
import { deepClone, getFileType, pathJoin, types, wait } from '../src/common'
import { formatTime } from '../src/date'

describe('common', () => {
    it('types', () => {
        expect(types('')).toBe('string')
        expect(types({})).toBe('object')
        expect(types([])).toBe('array')
        expect(types(100)).toBe('number')
        expect(types(null)).toBe('null')
        expect(types()).toBe('undefined')
        expect(types(/abcd/)).toBe('regexp')
        expect(types(new Date())).toBe('date')
        expect(types(true)).toBe('boolean')
        expect(types(() => {})).toBe('function')
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
    it('pathJoin', () => {
        expect(pathJoin('', '')).toBe('')
        expect(pathJoin('/upload/', '/2024/', '/1/')).toBe('/upload/2024/1')
        expect(pathJoin('/upload', '2024', '/1')).toBe('/upload/2024/1')
        expect(pathJoin('upload/', '/2024/', '/1/')).toBe('upload/2024/1')
        expect(pathJoin('upload', '2024', '1')).toBe('upload/2024/1')
        expect(pathJoin('upload', '/2024/', '/10/')).toBe('upload/2024/10')
    })
    it('getFileType', () => {
        expect(getFileType('a.png')).toBe('image')
        expect(getFileType('a.MP4')).toBe('video') // 大小写不敏感
        expect(getFileType('a.wmv')).toBe('video') // wmv 属视频
        expect(getFileType('a.wma')).toBe('audio') // wma 属音频
        expect(getFileType('a.png?v=1')).toBe('image') // 带查询参数
        expect(getFileType('a.xyz')).toBe('other') // 未知后缀
        expect(getFileType('')).toBe('other') // 无后缀统一返回 'other'
        expect(getFileType('README')).toBe('other') // 无扩展名
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

    it('bar', () => {
        expect(1 + 1).eq(2)
    })

    it('snapshot', () => {
        expect({ foo: 'bar' }).toMatchSnapshot()
    })
})
