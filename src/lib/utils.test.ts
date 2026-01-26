import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  delay,
  generateId,
  safeJsonParse,
  deepClone,
  isEmpty,
  capitalize,
  truncate,
  percentChange,
  clamp,
  roundTo,
  sum,
  average,
  groupBy,
  slugify,
  formatAddress,
} from './utils'

describe('delay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves after specified time', async () => {
    const promise = delay(1000)
    vi.advanceTimersByTime(1000)
    await expect(promise).resolves.toBeUndefined()
  })
})

describe('generateId', () => {
  it('generates unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })

  it('generates string IDs', () => {
    const id = generateId()
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    const result = safeJsonParse('{"a": 1}', {})
    expect(result).toEqual({ a: 1 })
  })

  it('returns fallback for invalid JSON', () => {
    const result = safeJsonParse('invalid', { default: true })
    expect(result).toEqual({ default: true })
  })

  it('returns fallback for empty string', () => {
    const result = safeJsonParse('', [])
    expect(result).toEqual([])
  })
})

describe('deepClone', () => {
  it('creates a deep copy', () => {
    const original = { a: { b: { c: 1 } } }
    const cloned = deepClone(original)

    expect(cloned).toEqual(original)
    expect(cloned).not.toBe(original)
    expect(cloned.a).not.toBe(original.a)
  })

  it('handles arrays', () => {
    const original = [1, [2, [3]]]
    const cloned = deepClone(original)

    expect(cloned).toEqual(original)
    expect(cloned[1]).not.toBe(original[1])
  })
})

describe('isEmpty', () => {
  it('returns true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('returns true for empty string and whitespace', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
  })

  it('returns true for empty array', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('returns true for empty object', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('returns false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(0)).toBe(false)
  })
})

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('handles already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...')
  })

  it('leaves short strings unchanged', () => {
    expect(truncate('Hi', 5)).toBe('Hi')
  })

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})

describe('percentChange', () => {
  it('calculates positive change', () => {
    expect(percentChange(100, 150)).toBe(50)
  })

  it('calculates negative change', () => {
    expect(percentChange(100, 80)).toBe(-20)
  })

  it('handles zero old value', () => {
    expect(percentChange(0, 100)).toBe(100)
    expect(percentChange(0, 0)).toBe(0)
  })
})

describe('clamp', () => {
  it('clamps value to range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })
})

describe('roundTo', () => {
  it('rounds to specified decimals', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14)
    expect(roundTo(3.145, 2)).toBe(3.15)
    expect(roundTo(3.1, 0)).toBe(3)
  })

  it('handles negative numbers', () => {
    expect(roundTo(-3.14159, 2)).toBe(-3.14)
  })
})

describe('sum', () => {
  it('sums array of numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })

  it('returns 0 for empty array', () => {
    expect(sum([])).toBe(0)
  })

  it('handles negative numbers', () => {
    expect(sum([1, -2, 3])).toBe(2)
  })
})

describe('average', () => {
  it('calculates average', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3)
  })

  it('returns 0 for empty array', () => {
    expect(average([])).toBe(0)
  })
})

describe('groupBy', () => {
  it('groups by key', () => {
    const items = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ]

    const grouped = groupBy(items, (item) => item.type)

    expect(grouped.a).toHaveLength(2)
    expect(grouped.b).toHaveLength(1)
  })
})

describe('slugify', () => {
  it('creates URL-safe slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('handles multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })
})

describe('formatAddress', () => {
  it('formats full address', () => {
    const result = formatAddress('123 Main St', 'Austin', 'TX', '78701')
    expect(result).toBe('123 Main St, Austin, TX 78701')
  })

  it('handles missing parts', () => {
    expect(formatAddress('123 Main St', null, null, null)).toBe('123 Main St')
    expect(formatAddress(null, 'Austin', 'TX', null)).toBe('Austin, TX')
  })

  it('returns default for all null', () => {
    expect(formatAddress(null, null, null, null)).toBe('No address')
  })
})
