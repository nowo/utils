import { describe, expect, it } from 'vitest'
import { parseQuery, pathJoin, stringifyQuery } from '../src/url'

describe('url', () => {
    it('pathJoin', () => {
        expect(pathJoin('', '')).toBe('')
        expect(pathJoin('/upload/', '/2024/', '/1/')).toBe('/upload/2024/1')
        expect(pathJoin('/upload', '2024', '/1')).toBe('/upload/2024/1')
        expect(pathJoin('upload/', '/2024/', '/1/')).toBe('upload/2024/1')
        expect(pathJoin('upload', '2024', '1')).toBe('upload/2024/1')
        expect(pathJoin('upload', '/2024/', '/10/')).toBe('upload/2024/10')
    })
    it('parseQuery', () => {
        expect(parseQuery('?a=1&b=2')).toEqual({ a: '1', b: '2' })
        expect(parseQuery('a=1&b=hello%20world')).toEqual({ a: '1', b: 'hello world' }) // 自动 decode
        expect(parseQuery('https://x.com/p?id=2&t=3')).toEqual({ id: '2', t: '3' }) // 完整 URL
        expect(parseQuery('?a=1#frag')).toEqual({ a: '1' }) // 忽略 hash
        expect(parseQuery('')).toEqual({})
    })
    it('stringifyQuery', () => {
        expect(stringifyQuery({ a: 1, b: 'x' })).toBe('a=1&b=x')
        expect(stringifyQuery({ a: 1, b: null, c: undefined })).toBe('a=1') // 跳过 null/undefined
        expect(stringifyQuery({ id: [1, 2] })).toBe('id=1&id=2') // 数组展开
        expect(stringifyQuery({ q: 'a b' })).toBe('q=a+b') // 自动 encode
    })
})
