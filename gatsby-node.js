const { createFilePath } = require('gatsby-source-filesystem')
const { tagPath, collectTags } = require('./src/utils/tags')
const { resolveTemplate } = require('./src/utils/templates')

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allMarkdownRemark {
        nodes {
          id
          fileAbsolutePath
          fields {
            slug
          }
          frontmatter {
            tags
            templateKey
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild('Error loading markdown content', result.errors)
    return
  }

  const pages = result.data.allMarkdownRemark.nodes

  // One page per markdown file, rendered with src/templates/<templateKey>.js.
  pages.forEach((node) => {
    createPage({
      path: node.fields.slug,
      component: resolveTemplate(node.frontmatter.templateKey, {
        source: node.fileAbsolutePath,
      }),
      context: { id: node.id },
    })
  })

  // One page per unique tag.
  const tagTemplate = resolveTemplate('tags')
  collectTags(pages).forEach((tag) => {
    createPage({
      path: tagPath(tag),
      component: tagTemplate,
      context: { tag },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type !== 'MarkdownRemark') return

  // e.g. src/pages/blog/2017-01-04-foo.md -> /blog/2017-01-04-foo/
  actions.createNodeField({
    name: 'slug',
    node,
    value: createFilePath({ node, getNode }),
  })
}
