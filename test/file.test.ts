import { afterEach, describe, expect, it, vi } from 'vitest'
import { base64ToBlob, blobToBase64, downloadFile, formatBytes, getFileExt, getFileType } from '../src/file'

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
    it('getFileExt', () => {
        expect(getFileExt('a.PNG')).toBe('png') // 转小写
        expect(getFileExt('a.tar.gz')).toBe('gz') // 取最后一段
        expect(getFileExt('a.png?v=1')).toBe('png') // 带查询参数
        expect(getFileExt('README')).toBe('') // 无扩展名
        expect(getFileExt('')).toBe('')
    })
    it('blobToBase64 / base64ToBlob 互转', async () => {
        const blob = new Blob(['hi'], { type: 'text/plain' })
        const dataURL = await blobToBase64(blob)
        expect(dataURL).toBe('data:text/plain;base64,aGk=')

        const restored = base64ToBlob(dataURL) // dataURL 自带类型
        expect(restored.type).toBe('text/plain')
        expect(await restored.text()).toBe('hi')

        const fromRaw = base64ToBlob('aGk=', 'text/plain') // 纯 base64 + 手动类型
        expect(await fromRaw.text()).toBe('hi')
    })
    it('downloadFile', () => {
        const click = vi.fn()
        const a = { click, style: {} } as unknown as HTMLAnchorElement
        vi.stubGlobal('document', {
            createElement: vi.fn(() => a),
            body: { appendChild: vi.fn(), removeChild: vi.fn() },
        })
        vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() })

        downloadFile(new Blob(['x']), 'f.txt')
        expect(a.download).toBe('f.txt')
        expect(a.href).toBe('blob:x')
        expect(click).toHaveBeenCalledOnce()
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:x') // Blob 用完释放

        downloadFile('https://a.com/f.pdf', 'f.pdf') // 直接 URL 不走 createObjectURL
        expect(a.href).toBe('https://a.com/f.pdf')
    })
})

afterEach(() => {
    vi.unstubAllGlobals()
})
