import { bench, describe } from 'vitest'
import {
    eachTreeList,
    filterTreeList,
    findTreeNodeItem,
    getTreeParentList,
    mapTreeList,
    searchTreeList,
    transformArrayToTreeList,
    transformTreeToArrayList,
} from '../src/tree'

// 构造约 910 个节点的三层树（10 根 × 10 子 × 8 孙）
interface Node { id: number, pid: number, name: string, children?: Node[] }
const flatList: Node[] = []
let counter = 0
for (let a = 0; a < 10; a++) {
    const rootId = ++counter
    flatList.push({ id: rootId, pid: 0, name: `node-${rootId}` })
    for (let b = 0; b < 10; b++) {
        const childId = ++counter
        flatList.push({ id: childId, pid: rootId, name: `node-${childId}` })
        for (let c = 0; c < 8; c++) {
            const gcId = ++counter
            flatList.push({ id: gcId, pid: childId, name: `node-${gcId}` })
        }
    }
}
const tree = transformArrayToTreeList(flatList) as Node[]
const targetId = counter // 最深、最后一个节点（查找最坏情况）

describe('tree', () => {
    bench('transformArrayToTreeList (数组转树)', () => {
        transformArrayToTreeList(flatList)
    })
    bench('transformTreeToArrayList (树转数组)', () => {
        transformTreeToArrayList(tree)
    })
    bench('findTreeNodeItem (按 id 查找)', () => {
        findTreeNodeItem(tree, targetId)
    })
    bench('getTreeParentList (祖先链路)', () => {
        getTreeParentList(tree, targetId)
    })
    bench('searchTreeList (模糊搜索)', () => {
        searchTreeList(tree, `node-${targetId}`, 'name')
    })
    bench('filterTreeList (按值过滤)', () => {
        filterTreeList(tree, `node-${targetId}`, 'name')
    })
    bench('eachTreeList (深度遍历)', () => {
        eachTreeList(tree, () => {})
    })
    bench('mapTreeList (映射新树)', () => {
        mapTreeList(tree, node => node)
    })
})
