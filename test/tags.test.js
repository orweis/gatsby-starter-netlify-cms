/** @jest-environment node */
const { tagPath, collectTags } = require('../src/utils/tags')

describe('tagPath', () => {
  it.each([
    ['brewing', '/tags/brewing/'],
    ['Small Batch', '/tags/small-batch/'],
    ['flavorWheel', '/tags/flavor-wheel/'],
    ['  coffee  beans ', '/tags/coffee-beans/'],
    ['café', '/tags/cafe/'],
  ])('maps %p to %p', (tag, expected) => {
    expect(tagPath(tag)).toBe(expected)
  })
})

describe('collectTags', () => {
  it('returns unique tags in first-seen order', () => {
    const nodes = [
      { frontmatter: { tags: ['coffee', 'brewing'] } },
      { frontmatter: { tags: ['brewing', 'chemex'] } },
    ]
    expect(collectTags(nodes)).toEqual(['coffee', 'brewing', 'chemex'])
  })

  it('ignores nodes without tags, null frontmatter and non-array tags', () => {
    const nodes = [
      { frontmatter: { tags: null } },
      { frontmatter: null },
      {},
      null,
      { frontmatter: { tags: 'not-a-list' } },
      { frontmatter: { tags: ['ok'] } },
    ]
    expect(collectTags(nodes)).toEqual(['ok'])
  })

  it('skips empty, blank and non-string tag values', () => {
    const nodes = [{ frontmatter: { tags: ['', '   ', null, 42, 'real'] } }]
    expect(collectTags(nodes)).toEqual(['real'])
  })

  it('handles missing input', () => {
    expect(collectTags(undefined)).toEqual([])
    expect(collectTags([])).toEqual([])
  })
})
