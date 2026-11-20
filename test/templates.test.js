/** @jest-environment node */
const path = require('path')
const { resolveTemplate, TEMPLATES_DIR } = require('../src/utils/templates')

describe('resolveTemplate', () => {
  it.each(['blog-post', 'index-page', 'about-page', 'product-page', 'tags'])(
    'resolves existing template %p',
    (key) => {
      expect(resolveTemplate(key)).toBe(path.join(TEMPLATES_DIR, `${key}.js`))
    }
  )

  it.each([undefined, null, '', 42])(
    'rejects a missing templateKey (%p) and names the source file',
    (key) => {
      expect(() => resolveTemplate(key, { source: 'src/pages/x.md' })).toThrow(
        /Missing "templateKey" frontmatter in src\/pages\/x\.md/
      )
    }
  )

  it.each([
    '../../gatsby-config',
    '../templates/blog-post',
    'blog-post.js',
    'Blog-Post',
    'blog_post',
    'blog post',
    '/etc/passwd',
    '-blog',
  ])('rejects unsafe or malformed key %p', (key) => {
    expect(() => resolveTemplate(key)).toThrow(/Invalid templateKey/)
  })

  it('rejects a well-formed key without a template file', () => {
    expect(() => resolveTemplate('does-not-exist')).toThrow(
      /Unknown templateKey "does-not-exist"/
    )
  })
})
