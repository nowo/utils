import { defineConfig } from 'vitepress'
import typedocSidebar from '../api/typedoc-sidebar.json'

export default defineConfig({
    title: '@wzo/utils',
    description: '常用 TypeScript 工具函数库',
    lang: 'zh-CN',
    base: '/utils/',
    cleanUrls: true,
    lastUpdated: true,
    themeConfig: {
        nav: [
            { text: '指南', link: '/guide/' },
            { text: 'API', link: '/api/' },
        ],
        sidebar: {
            '/guide/': [
                {
                    text: '指南',
                    items: [
                        { text: '快速开始', link: '/guide/' },
                    ],
                },
            ],
            '/api/': [
                {
                    text: 'API 参考',
                    items: typedocSidebar,
                },
            ],
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/nowo/utils' },
        ],
        search: {
            provider: 'local',
        },
        outline: {
            label: '页面导航',
        },
        docFooter: {
            prev: '上一页',
            next: '下一页',
        },
        lastUpdatedText: '最后更新',
    },
})
