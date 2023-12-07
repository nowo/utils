import { describe, expect, it } from 'vitest'
import { formatTime } from '../src/date'
import { types } from '../src/common'

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
    })
})

describe('date', () => {
    it('formatTime', () => {
        expect(formatTime()).toMatch(/^2023-/)
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
