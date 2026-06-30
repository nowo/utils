import { describe, expect, it } from 'vitest'
import {
    filterTreeList,
    findTreeNodeItem,
    getTreeParentItem,
    getTreeParentList,
    searchTreeList,
    transformArrayToTreeList,
    transformTreeToArrayList,
} from '../src/tree'

function makeList() {
    return [
        {
            name: 'option1',
            id: 1,
            children: [
                { name: 'option1.1', id: 3 },
                { name: 'option1.2', id: 5 },
            ],
        },
        { name: 'option2', id: 2 },
    ]
}

describe('searchTreeList', () => {
    it('子级模糊命中时带上父级', () => {
        const result = searchTreeList(makeList(), '.1', 'name')
        expect(result).toEqual([
            { name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3 }] },
        ])
    })

    it('自身命中则整项（含全部子级）保留', () => {
        const result = searchTreeList(makeList(), 'option1', 'name')
        expect(result).toHaveLength(1)
        expect(result[0].children).toHaveLength(2)
    })

    it('支持自定义 children 键名', () => {
        const list = [{ name: 'a', id: 1, sub: [{ name: 'a.target', id: 3 }] }]
        const result = searchTreeList(list, 'target', 'name', 'sub')
        expect(result).toEqual([{ name: 'a', id: 1, sub: [{ name: 'a.target', id: 3 }] }])
    })

    it('多层嵌套也能逐级带出父级', () => {
        const list = [
            { name: 'L1', id: 1, children: [{ name: 'L2', id: 2, children: [{ name: 'L3-keyword', id: 3 }] }] },
        ]
        const result = searchTreeList(list, 'keyword', 'name')
        expect(result).toEqual([
            { name: 'L1', id: 1, children: [{ name: 'L2', id: 2, children: [{ name: 'L3-keyword', id: 3 }] }] },
        ])
    })

    it('无匹配返回空数组', () => {
        expect(searchTreeList(makeList(), '不存在', 'name')).toEqual([])
    })

    it('字段缺失不抛错', () => {
        const list = [{ id: 1, children: [{ id: 2 }] }] as any[]
        expect(() => searchTreeList(list, 'x', 'name')).not.toThrow()
        expect(searchTreeList(list, 'x', 'name')).toEqual([])
    })

    it('不修改原始数据', () => {
        const list = makeList()
        searchTreeList(list, 'option1', 'name')
        expect(list).toEqual(makeList())
    })
})

describe('filterTreeList', () => {
    it('严格过滤，子级同样处理，不改原数据', () => {
        const list = [
            { name: 'a', id: 1, keep: true, children: [{ name: 'a.1', id: 3, keep: true }, { name: 'a.2', id: 5, keep: false }] },
            { name: 'b', id: 2, keep: false },
        ]
        const snapshot = JSON.parse(JSON.stringify(list))
        const result = filterTreeList(list, true, 'keep')
        expect(result).toEqual([
            { name: 'a', id: 1, keep: true, children: [{ name: 'a.1', id: 3, keep: true }] },
        ])
        expect(list).toEqual(snapshot)
    })
})

describe('transformTreeToArrayList', () => {
    it('展平并给子级写入 pid，不修改入参', () => {
        const list = makeList()
        const flat = transformTreeToArrayList(list)
        expect(flat.map(i => i.name)).toEqual(['option1', 'option1.1', 'option1.2', 'option2'])
        expect(flat.find(i => i.id === 3)).toMatchObject({ id: 3, pid: 1 })
        // 根节点无 pid，入参不被污染
        expect(list[0].children![0]).toEqual({ name: 'option1.1', id: 3 })
    })
})

describe('transformArrayToTreeList', () => {
    it('平级数组转树，不修改入参', () => {
        const arr = [
            { name: 'o1', id: 1 },
            { name: 'o1.1', id: 3, pid: 1 },
            { name: 'o2', id: 2 },
        ]
        const tree = transformArrayToTreeList(arr)
        expect(tree).toHaveLength(2)
        expect((tree[0] as any).children).toEqual([{ name: 'o1.1', id: 3, pid: 1 }])
        // 入参原对象不被加上 children
        expect(arr[0]).toEqual({ name: 'o1', id: 1 })
    })

    it('字段冲突时抛错', () => {
        expect(() => transformArrayToTreeList([{ id: 1, children: [] } as any])).toThrow()
    })
})

describe('getTreeParentItem / getTreeParentList / findTreeNodeItem', () => {
    it('getTreeParentItem 默认 key 为 id', () => {
        const parent = getTreeParentItem(makeList(), 3)
        expect(parent).toMatchObject({ id: 1, name: 'option1' })
    })

    it('getTreeParentList 返回祖先链', () => {
        expect(getTreeParentList(makeList(), 3)).toEqual([
            { name: 'option1', id: 1, children: [{ name: 'option1.1', id: 3 }, { name: 'option1.2', id: 5 }] },
            { name: 'option1.1', id: 3 },
        ])
    })

    it('findTreeNodeItem 取得对应项', () => {
        expect(findTreeNodeItem(makeList(), 3)).toEqual({ name: 'option1.1', id: 3 })
    })

    it('未找到时的返回值', () => {
        expect(getTreeParentItem(makeList(), 999)).toBeUndefined()
        expect(getTreeParentList(makeList(), 999)).toEqual([])
    })

    it('getTreeParentList 命中根节点返回单元素链路', () => {
        expect(getTreeParentList(makeList(), 1).map(i => i.id)).toEqual([1])
    })
})

describe('transformTreeToArrayList ↔ transformArrayToTreeList 往返', () => {
    it('树展平后再还原结构一致', () => {
        const tree = makeList()
        const flat = transformTreeToArrayList(tree).map(({ children: _children, ...rest }: any) => rest) // 去掉残留 children 字段
        const rebuilt = transformArrayToTreeList(flat)
        expect(rebuilt.map((i: any) => i.id).sort()).toEqual([1, 2])
        const node1 = rebuilt.find((i: any) => i.id === 1) as any
        expect(node1.children.map((c: any) => c.id).sort()).toEqual([3, 5])
    })
})
