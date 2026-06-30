# 快速开始

`@wzo/utils` 是一个基于 TypeScript 的轻量工具函数库，提供类型判断、深拷贝、时间格式化、树结构处理等常用方法。

## 安装

::: code-group

```bash [pnpm]
pnpm add @wzo/utils
```

```bash [npm]
npm install @wzo/utils
```

```bash [yarn]
yarn add @wzo/utils
```

:::

## 使用

按需导入即可，支持 ESM 与 CJS：

```ts
import { deepClone, formatTime, types } from '@wzo/utils'

types([]) // 'array'
formatTime(1472048779952) // '2016-08-24 22:26:19'
deepClone({ id: 1 }) // { id: 1 }
```

完整方法列表见 [API 参考](/api/)。
