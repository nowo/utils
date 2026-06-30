import { describe, expect, it } from 'vitest'
import { formatBytes, getFileType } from '../src/file'

describe('file', () => {
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
    it('formatBytes', () => {
        expect(formatBytes(0)).toBe('0B')
        expect(formatBytes(500)).toBe('500B')
        expect(formatBytes(1024)).toBe('1KB')
        expect(formatBytes(1536)).toBe('1.5KB')
        expect(formatBytes(1048576)).toBe('1MB')
        expect(formatBytes(-1)).toBe('') // 非法
    })
})
