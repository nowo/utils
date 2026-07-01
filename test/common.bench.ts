import { bench, describe } from 'vitest'
import { deepClone, deepEqual, getRandomId } from '../src/common'

const obj = {
    id: 1,
    name: 'hello',
    tags: ['a', 'b', 'c'],
    nested: { x: 1, y: { z: [1, 2, 3, 4, 5] }, list: Array.from({ length: 50 }, (_, i) => ({ i })) },
}
const objB = structuredClone(obj)

describe('deepClone', () => {
    bench('deepClone (structuredClone)', () => {
        deepClone(obj)
    })
    bench('原生 JSON.parse/stringify', () => {
        JSON.parse(JSON.stringify(obj))
    })
})

describe('deepEqual', () => {
    bench('deepEqual', () => {
        deepEqual(obj, objB)
    })
    bench('原生 JSON.stringify 对比', () => {
        const _equal = JSON.stringify(obj) === JSON.stringify(objB)
    })
})

describe('getRandomId', () => {
    bench('getRandomId(8)', () => {
        getRandomId(8)
    })
    bench('getRandomId(21)', () => {
        getRandomId(21)
    })
})
