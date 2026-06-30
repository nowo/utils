### @wzo/utils
常用的一些方法
#### 安装
```bash
npm i @wzo/utils
# or
yarn add @wzo/utils
# or
pnpm i @wzo/utils
```

### 详细内容
<a href="https://nowo.github.io/utils/">文档详细介绍</a>

#### 方法
- 获取时间,并格式化
```ts
import { formatTime } from '@wzo/utils'

formatTime(new Date(), 'YYYY-mm-dd HH:MM:SS') // 2021-12-29 09:46:08
```
