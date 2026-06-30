import { deepClone } from './common'

/**
 * 根据当前一级id(或字段)查找上级所有的节点内容（平级）
 * @param data 嵌套数组
 * @param val 需要查找的值
 * @param key 查找值对应的键值，默认为id
 * @param children 子类的键值，默认children
 * @returns any[]
 * @example
 * ```ts
 *
 * let list = [
 *     {
 *         name: 'option1', id: 1,
 *         children: [
 *             { name: 'option1.1', id: 3 }
 *         ]
 *     },
 *     { name: 'option2', id: 2 }
 * ]
 * getTreeParentsList(list, 3, 'id', 'children') // [{ name: 'option1', id: 1 }, { name: 'option1.1', id: 3 }]
 *
 * ```
 */
export function getTreeParentList<T = any>(data: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T[] {
    // 深度优先：找到目标节点时，path 中即为「根 → 目标」的完整链路
    const path: T[] = []
    const dfs = (arr: any[]): boolean => {
        for (const item of arr) {
            path.push(item)
            if (item[key] === val) return true // 命中目标，链路即 path
            if (Array.isArray(item[children]) && dfs(item[children])) return true
            path.pop() // 该分支未命中，回溯
        }
        return false
    }
    dfs(data as any[])
    return path
}

/**
 * 树形数据查找到上一级（父级）
 * @param data 全部数据
 * @param val 用于模糊查询的关键字
 * @param key 查找关键字对应的那个键名
 * @param children 子类元素集合的键名，默认为'children'
 * @return {T} 父级内容
 * @example
 * ```ts
 * let list = [
 *     {
 *         name: 'option1', id: 1,
 *         children: [
 *             { name: 'option1.1', id: 3 }
 *         ]
 *     },
 *     { name: 'option2', id: 2 }
 * ]
 * getTreeParentItem(list, 3, 'id', 'children') // { name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3 }] }
 * ```
 */
export const getTreeParentItem = <T = any>(data: T[], val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T | undefined => {
    let temp: any = ''
    const forFn = function (arr: any[], id: T[keyof T]) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (item[children]) {
                const node = item[children].find((opt: any) => opt[key] === id)
                if (node) {
                    temp = item
                    break
                } else {
                    forFn(item[children], id)
                }
            }
        }
    }
    forFn(data, val)
    return temp || undefined
}

/**
 * 从树形数据中取得对应的项， 传入需要遍历的数组，需要匹配的id(根据id取得对应的那一项)
 * @param data 数组数据，平级或树形数组皆可
 * @param val 键值id的值，（唯一）
 * @param key id 默认（唯一不重复的键值）
 * @param children 子类
 * @returns {T} 对应的项
 * @example
 * ```ts
 * let list = [
 *     {
 *         name: 'option1', id: 1,
 *         children: [
 *             { name: 'option1.1', id: 3 }
 *         ]
 *     },
 *     { name: 'option2', id: 2 }
 * ]
 * findNodeItem(list, 3, 'id', 'children') // { name: 'option1.1', id: 3 }
 * ```
 *
 */
export function findTreeNodeItem<T = any>(data: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T | undefined {
    let temp: any = ''
    const forFn = function (arr: any[], id: T[keyof T]) {
        for (let i = 0; i < arr.length; i++) {
            if (temp) break // 已经拿到值了,就退出循环

            const item = arr[i]
            // 找到值对应的那一项，赋值
            if (item[key] === val) temp = item
            // 有子类，子类继续循环
            if (item[children]) forFn(item[children], id)
        }
    }
    forFn(data, val)
    return temp
}

// filterTreeList 的内部递归实现：入参已是深拷贝副本，故递归内不再克隆
function filterTreeNodes<T = any>(list: T[], val: T[keyof T], name: keyof T, children: keyof T): T[] {
    return list.filter((item: any) => {
        if (item[children]?.length) item[children] = filterTreeNodes(item[children], val, name, children)
        return item[name] === val
    })
}

/**
 * 树形数据过滤,保留符合条件的数据（子类数据也照样处理），不改变原有数据
 * @param data 全部数据
 * @param val 键值name对应的值，符合条件的值
 * @param name 值对应的那个键名
 * @param children 子类元素集合的键名，默认为'children'
 * @example
 * ```js
 * let list = [
 *     {
 *         name: 'option1', id: 1, is_hidden: true,
 *         children: [
 *             { name: 'option1.1', id: 3, is_hidden: true },
 *             { name: 'option1.2', id: 5, is_hidden: false }
 *         ]
 *     },
 *     {
 *         name: 'option2', id: 2, is_hidden: false
 *         children: [
 *             { name: 'option2.1', id: 4, is_hidden: false }
 *         ]
 *     },
 * ]
 * filterTreeList(list, true, 'is_hidden', 'children') // [{ name: 'option1', id: 1, is_hidden: true,children: [{ name: 'option1.1', id: 3, is_hidden: true }] }]
 * ```
 */
export function filterTreeList<T = any>(data: T[], val: T[keyof T], name: keyof T, children = 'children' as keyof T): T[] {
    // 只在入口深拷贝一次，递归内部直接复用，避免每层重复克隆子树
    return filterTreeNodes(deepClone(data), val, name, children)
}

/**
 * 树形数据过滤（模糊匹配），上级匹配上就直接全部返回(包括子类)，匹配到子类就往上找父级
 * @param data 全部数据
 * @param keyword 用于模糊查询的关键字
 * @param name 查找关键字对应的那个键名
 * @param children 子类元素集合的键名，默认为'children'
 * @example
 * ```js
 * let list = [
 *     {
 *         name: 'option1', id: 1,
 *         children: [
 *             { name: 'option1.1', id: 3 }
 *         ]
 *     },
 *     { name: 'option2', id: 2 }
 * ]
 * searchTreeList(list, '.1', 'name', 'children') // [{ name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3 }] }]
 * ```
 */
export function searchTreeList<T = any>(data: T[], keyword: T[keyof T], name: keyof T, children = 'children' as keyof T): T[] {
    const result: any[] = []
    for (const item of data as any[]) {
        const field = item[name]
        const val = typeof field === 'number' ? String(field) : field
        // 自身模糊命中：整项保留（含全部子级）
        if (typeof val === 'string' && val.includes(keyword as any)) {
            result.push(item)
        } else {
            const childList = item[children]
            if (Array.isArray(childList) && childList.length > 0) {
                // 子级递归模糊匹配，命中则带上当前父级
                const matchedChildren = searchTreeList(childList, keyword, name, children)
                if (matchedChildren.length > 0) result.push({ ...item, [children]: matchedChildren })
            }
        }
    }
    return result
}

/**
 * 树形json数据数组转平级普通数组
 * @param classifyList 嵌套数组
 * @param id 关联的键值，默认id
 * @param key 上级所属的键值，默认pid
 * @param children 嵌套数组的子类，子类的键值，默认children
 * @returns any[]
 * ```js
 * let list = [
 *     {
 *         name: 'option1', id: 1,
 *         children: [
 *             { name: 'option1.1', id: 3 }
 *         ]
 *     },
 *     { name: 'option2', id: 2 }
 * ]
 *
 * transformTreeToArrayList(list, 'id', 'pid', 'children') // [{ name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3, pid: 1 }] }, { name: 'option1.1', id: 3, pid: 1 }, { name: 'option2', id: 2 }]
 * ```
 */
export function transformTreeToArrayList<T = any>(classifyList: Array<T>, id = 'id' as keyof T, key = 'pid', children = 'children' as keyof T): T[] {
    const temp: any[] = []
    const forFn = function (arr: any[], val = 0) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (val) item[key] = val
            temp.push(item)

            if (item[children]) forFn(item[children], item[id])
        }
    }
    // 深拷贝后再处理，避免给调用方原数据写入 pid / 改动结构
    forFn(deepClone(classifyList))
    return temp
}

/**
 * @function 将普通的数组转换为父子结构（一级数组->多级数组）
 * @param sNodes 普通的数组（需要转换成父子结构的数组）
 * @param child 子类的字段名，默认为children
 * @param id 数组项唯一的id字段名，默认为id
 * @param pid 归属于哪个id的字段名（父id字段名），默认为pid
 * @returns Array
 * @example
 * ```js
 * const list = [
 *     { name: 'option1', id: 1 },
 *     { name: 'option1.1', id: 3, pid: 1 },
 *     { name: 'option2', id: 2 },
 * ]
 * transformArrayToTreeList(list, 'children', 'id', 'pid') // [{ name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3, pid: 1 }] }, { name: 'option2', id: 2 }]
 * ```
 */
export function transformArrayToTreeList<T = any>(sNodes: T[], child = 'children' as keyof T, id = 'id' as keyof T, pid = 'pid' as keyof T) { // 将普通的数组转换为父子结构
    // var id = "id";    //id字段名
    // var pid = "pid";  //父id字段名

    // 深拷贝后再处理，避免给调用方原数据写入 children 字段
    const nodes = deepClone(sNodes)
    const r = []
    const tmpMap: any = {}
    for (let i = 0; i < nodes.length; i++) {
        // 判断原先数组有没有这个字段
        if (nodes[i][child]) {
            throw new Error(`数组中存在${String(child)}字段，换一个参数`)
        }
        tmpMap[nodes[i][id]] = nodes[i]
    }
    for (let i = 0; i < nodes.length; i++) {
        const p = tmpMap[nodes[i][pid]] // 得到会在子类的项

        if (p && nodes[i][id] !== nodes[i][pid]) {
            // 判断是否有child数组,没有就给个空数组（也就是刚开始的时候）
            p[child] = p[child] ? p[child] : []
            p[child].push(nodes[i]) // 追加到当前项
        } else {
            r.push(nodes[i])
        }
    }
    return r
}
