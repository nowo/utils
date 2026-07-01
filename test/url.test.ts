import { describe, expect, it } from 'vitest'
import { parseQuery, pathJoin, setQueryParam, stringifyQuery } from '../src/url'

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
        expect(parseQuery('https://a.com/p?id=2&t=3')).toEqual({ id: '2', t: '3' }) // 完整 URL
        expect(parseQuery('?a=1#frag')).toEqual({ a: '1' }) // 忽略 hash
        expect(parseQuery('')).toEqual({})
    })
    it('stringifyQuery', () => {
        expect(stringifyQuery({ a: 1, b: 'x' })).toBe('a=1&b=x')
        expect(stringifyQuery({ a: 1, b: null, c: undefined })).toBe('a=1') // 跳过 null/undefined
        expect(stringifyQuery({ id: [1, 2] })).toBe('id=1&id=2') // 数组展开
        expect(stringifyQuery({ q: 'a b' })).toBe('q=a+b') // 自动 encode
    })
    it('setQueryParam', () => {
        expect(setQueryParam('/p?a=1', { b: 2 })).toBe('/p?a=1&b=2') // 追加
        expect(setQueryParam('/p?a=1', { a: 2 })).toBe('/p?a=2') // 覆盖
        expect(setQueryParam('/p', { a: 1 })).toBe('/p?a=1') // 原本无 query
        expect(setQueryParam('/p?a=1&b=2', { b: null })).toBe('/p?a=1') // null 删除
        expect(setQueryParam('/p?a=1', { a: undefined })).toBe('/p') // 删空后无 query
        expect(setQueryParam('/p?a=1#top', { b: 2 })).toBe('/p?a=1&b=2#top') // 保留 hash
        expect(setQueryParam('/p?a=1', { ids: [1, 2] })).toBe('/p?a=1&ids=1&ids=2') // 数组展开
        expect(setQueryParam('https://a.com/p?a=1', { b: 2 })).toBe('https://a.com/p?a=1&b=2') // 完整 URL
    })
})
