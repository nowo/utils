/**
 * 根据当前一级id(或字段)查找上级所有的节点内容（平级）
 * @param data 嵌套数组
 * @param val 需要查找的值
 * @param key 查找值对应的键值，默认为id
 * @param children 子类的键值，默认children
 * @returns any[]
 * @example
 * ```js|ts
 * let list = [
 *     {
 *         name: '深圳', id: 1,
 *         children: [
 *             { name: '南山区', id: 3 }
 *         ]
 *     },
 *     { name: '广州', id: 2 }
 * ]
 * getTreeParentsList(list, 3, 'id', 'children') // [{ name: '深圳', id: 1 }, { name: '南山区', id: 3 }]
 * ```
 */
export function getTreeParentsList<T = any>(data: Array<T>, val: T[keyof T], key = 'id' as keyof T, children = 'children' as keyof T): T[] {
    const temp: any[] = []
    const forFn = function (arr: any[], id: T[keyof T]) {
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            // 找到值对应的那一项，追加进去
            if (item[key] === val) temp.push(item)

            if (item[children]) {
                const data1 = item[children].find((item1: any) => {
                    return item1[key] === id
                })
                if (data1) {
                    temp.unshift(item) // 数组前面追加进去
                    forFn(data, item[key])
                    break
                } else {
                    forFn(item[children], id)
                }
            }
        }
    }
    forFn(data, val)
    return temp
}

/**
 * 从树形数据中取得对应的项， 传入需要遍历的数组，需要匹配的id(根据id取得对应的那一项)
 * @param data 数组数据，平级或树形数组皆可
 * @param val 键值id的值，（唯一）
 * @param key id 默认（唯一不重复的键值）
 * @param children 子类
 * @returns
 * @example
 * ```js|ts
 * let list = [
 *     {
 *         name: '深圳', id: 1,
 *         children: [
 *             { name: '南山区', id: 3 }
 *         ]
 *     },
 *     { name: '广州', id: 2 }
 * ]
 * findNodeItem(list, 3, 'id', 'children') // { name: '南山区', id: 3 }
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

/**
 * 树形数据过滤（模糊匹配），上级匹配上就直接全部返回(包括子类)，匹配到子类就往上找父级
 * @param data 全部数据
 * @param keyword 用于模糊查询的关键字
 * @param name 查找关键字对应的那个键名
 * @param children 子类元素集合的键名，默认为'children'
 * @example
 * ```js|ts
 * let list = [
 *     {
 *         name: '深圳', id: 1,
 *         children: [
 *             { name: '南山区', id: 3 }
 *         ]
 *     },
 *     { name: '广州', id: 2 }
 * ]
 * filterTreeList(list, '区', 'id', 'children') // [{ name: '深圳', id: 1, children: [{ name: '南山区', id: 3 }] }]
 * ```
 */
export function filterTreeList<T = any>(data: T[], keyword: T[keyof T], name: keyof T, children = 'children' as keyof T): T[] {
    const result: any[] = []
    let item: any
    for (item of data) {
        if (item[name].includes(keyword)) {
            result.push(item)
        } else if (item.children && item.children.length > 0) {
            const filteredChildren = filterTreeList(item.children, keyword, name, children)
            if (filteredChildren.length > 0) {
                result.push({ ...item, children: filteredChildren })
            }
        }
    }
    return result
}
