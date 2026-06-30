# @wzo/utils

[![npm version](https://img.shields.io/npm/v/@wzo/utils.svg)](https://www.npmjs.com/package/@wzo/utils)
[![npm downloads](https://img.shields.io/npm/dm/@wzo/utils.svg)](https://www.npmjs.com/package/@wzo/utils)
[![license](https://img.shields.io/npm/l/@wzo/utils.svg)](https://github.com/nowo/utils)

常用的 TypeScript 工具函数库：类型判断、深拷贝、时间格式化、文件类型识别、树形结构处理等。开箱即用，自带类型声明，同时支持 ESM 与 CJS。

## 安装

```bash
pnpm add @wzo/utils
# 或
npm i @wzo/utils
# 或
yarn add @wzo/utils
```

## 快速开始

```ts
import { deepClone, formatTime, types } from '@wzo/utils'

types([]) // 'array'
formatTime('2023/09/09 10:30:50') // '2023-09-09 10:30:50'
deepClone({ id: 1, nested: { a: 1 } })
```

> 📖 完整 API 与示例见在线文档：<https://nowo.github.io/utils/>

## API

### 通用（common）

| 方法 | 说明 |
| --- | --- |
| `types(value)` | 判断数据类型，返回 `'string' \| 'array' \| 'object' \| 'number' \| 'date' \| 'regexp' \| 'boolean' \| 'function' \| 'null' \| 'undefined'` 等 |
| `wait(ms)` | 返回一个在 `ms` 毫秒后 resolve 的 Promise（值为 `ms`），用于 `await` 延时 |
| `deepClone(data)` | 深拷贝（优先 `structuredClone`，失败时回退手动递归），不修改原数据 |
| `getFileType(fileName)` | 按扩展名判断文件分类：`image / txt / excel / word / pdf / video / audio / zip / other` |
| `formatBytes(bytes, decimals?)` | 字节数转可读大小，如 `1536 → '1.5KB'` |
| `pathJoin(...segments)` | 拼接 URL/路径片段，自动去除多余斜杠与空段 |
| `parseQuery(str)` | query 串/完整 URL → 对象（自动 decode，忽略 hash） |
| `stringifyQuery(obj)` | 对象 → query 串（自动 encode，跳过 `null`/`undefined`，数组展开） |
| `isEmpty(value)` | 判空：`'' / [] / {} / null / undefined / 空 Map\|Set`（`0`、`false` 不算空） |
| `toThousands(num)` | 数字千分位，如 `1234567 → '1,234,567'` |
| `debounce(fn, wait?, immediate?)` | 防抖，返回的函数带 `cancel()` 取消方法 |
| `throttle(fn, wait?)` | 节流（首次立即执行） |

```ts
import { formatBytes, getFileType, parseQuery, pathJoin, toThousands } from '@wzo/utils'

getFileType('photo.PNG') // 'image'（大小写不敏感）
formatBytes(1234567) // '1.18MB'
pathJoin('/upload/', '/2024/', '/1/') // '/upload/2024/1'
parseQuery('?a=1&b=hello%20world') // { a: '1', b: 'hello world' }
toThousands(1234567.89) // '1,234,567.89'
```

### 时间（date）

| 方法 | 说明 |
| --- | --- |
| `formatTime(num?, format?)` | 时间戳 / 时间字符串 / `Date` 格式化为指定格式，默认 `'YYYY-mm-dd HH:MM:SS'` |
| `timeAgo(time?)` | 相对时间，如 `刚刚 / 3分钟前 / 2小时前 / 5天前` |

```ts
import { formatTime, timeAgo } from '@wzo/utils'

formatTime() // 当前时间，默认格式
formatTime('2023/09/09 10:30:50', 'YYYY年mm月dd日') // '2023年09月09日'
formatTime(1694253088) // 10 位秒级时间戳同样支持
timeAgo(Date.now() - 60_000) // '1分钟前'
```

### 树形结构（tree）

| 方法 | 说明 |
| --- | --- |
| `findTreeNodeItem(data, val, key?, children?)` | 在树中按 `key`（默认 `'id'`）查找对应节点 |
| `getTreeParentItem(data, val, key?, children?)` | 查找某节点的直接父级，未找到返回 `undefined` |
| `getTreeParentList(data, val, key?, children?)` | 返回「根 → 目标节点」的完整祖先链路 |
| `filterTreeList(data, val, name, children?)` | 按 `item[name] === val` 严格过滤（子级一并处理），不改原数据 |
| `searchTreeList(data, keyword, name, children?)` | 模糊查找：节点命中则整项保留，子级命中则带上其父级，不改原数据 |
| `transformTreeToArrayList(list, id?, key?, children?)` | 树形数组 → 平级数组，并写入 `pid`，不改原数据 |
| `transformArrayToTreeList(list, child?, id?, pid?)` | 平级数组 → 树形数组，不改原数据 |
| `eachTreeList(data, cb, children?)` | 深度遍历每个节点，回调返回 `false` 可跳过其子级 |
| `mapTreeList(data, cb, children?)` | 映射为结构相同的新树，不改原数据 |

```ts
import { searchTreeList, transformArrayToTreeList } from '@wzo/utils'

const list = [
    { name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3 }] },
    { name: 'option2', id: 2 },
]

// 模糊查找：命中子级时带出父级
searchTreeList(list, '1.1', 'name')
// [{ name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3 }] }]

// 平级数组转树
transformArrayToTreeList([
    { name: 'o1', id: 1 },
    { name: 'o1.1', id: 3, pid: 1 },
])
// [{ name: 'o1', id: 1, children: [{ name: 'o1.1', id: 3, pid: 1 }] }]
```

## 文档

完整 API、参数说明与更多示例：<https://nowo.github.io/utils/>

## License

[ISC](https://github.com/nowo/utils)
