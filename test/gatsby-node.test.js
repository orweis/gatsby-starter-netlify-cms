/** @jest-environment node */
const path = require('path')
const { createPages, onCreateNode } = require('../gatsby-node')

jest.mock('gatsby-source-filesystem', () => ({
  createFilePath: jest.fn(() => '/blog/hello-world/'),
}))

const TEMPLATES = path.resolve(__dirname, '..', 'src', 'templates')

const markdownNode = (overrides = {}) => ({
  id: 'id-1',
  fileAbsolutePath: '/site/src/pages/blog/hello.md',
  fields: { slug: '/blog/hello/' },
  frontmatter: { templateKey: 'blog-post', tags: [] },
  ...overrides,
})

const run = async (nodes, { errors } = {}) => {
  const createPage = jest.fn()
  const reporter = { panicOnBuild: jest.fn() }
  const graphql = jest
    .fn()
    .mockResolvedValue(
      errors ? { errors } : { data: { allMarkdownRemark: { nodes } } }
    )
  await createPages({ actions: { createPage }, graphql, reporter })
  return { createPage, reporter }
}

describe('createPages', () => {
  it('creates one page per markdown node using its template', async () => {
    const { createPage } = await run([
      markdownNode(),
      markdownNode({
        id: 'id-2',
        fields: { slug: '/about/' },
        frontmatter: { templateKey: 'about-page', tags: null },
      }),
    ])

    expect(createPage).toHaveBeenCalledWith({
      path: '/blog/hello/',
      component: path.join(TEMPLATES, 'blog-post.js'),
      context: { id: 'id-1' },
    })
    expect(createPage).toHaveBeenCalledWith({
      path: '/about/',
      component: path.join(TEMPLATES, 'about-page.js'),
      context: { id: 'id-2' },
    })
    expect(createPage).toHaveBeenCalledTimes(2)
  })

  it('creates a single page per unique tag', async () => {
    const { createPage } = await run([
      markdownNode({
        frontmatter: { templateKey: 'blog-post', tags: ['Coffee', 'brewing'] },
      }),
      markdownNode({
        id: 'id-2',
        frontmatter: { templateKey: 'blog-post', tags: ['brewing'] },
      }),
    ])

    const tagPages = createPage.mock.calls
      .map(([page]) => page)
      .filter((page) => page.component === path.join(TEMPLATES, 'tags.js'))
    expect(tagPages).toEqual([
      {
        path: '/tags/coffee/',
        component: path.join(TEMPLATES, 'tags.js'),
        context: { tag: 'Coffee' },
      },
      {
        path: '/tags/brewing/',
        component: path.join(TEMPLATES, 'tags.js'),
        context: { tag: 'brewing' },
      },
    ])
  })

  it('fails the build with a clear message for an unknown templateKey', async () => {
    await expect(
      run([markdownNode({ frontmatter: { templateKey: 'nope' } })])
    ).rejects.toThrow(
      /Unknown templateKey "nope" in \/site\/src\/pages\/blog\/hello\.md/
    )
  })

  it('reports GraphQL errors and creates no pages', async () => {
    const errors = [new Error('boom')]
    const { createPage, reporter } = await run([], { errors })
    expect(reporter.panicOnBuild).toHaveBeenCalledWith(
      'Error loading markdown content',
      errors
    )
    expect(createPage).not.toHaveBeenCalled()
  })
})

describe('onCreateNode', () => {
  it('adds a slug field to MarkdownRemark nodes', () => {
    const createNodeField = jest.fn()
    const node = { internal: { type: 'MarkdownRemark' } }
    onCreateNode({ node, actions: { createNodeField }, getNode: jest.fn() })
    expect(createNodeField).toHaveBeenCalledWith({
      name: 'slug',
      node,
      value: '/blog/hello-world/',
    })
  })

  it('ignores other node types', () => {
    const createNodeField = jest.fn()
    onCreateNode({
      node: { internal: { type: 'File' } },
      actions: { createNodeField },
      getNode: jest.fn(),
    })
    expect(createNodeField).not.toHaveBeenCalled()
  })
})
