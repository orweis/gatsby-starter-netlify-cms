// Shared helpers for tag pages. Written in CommonJS so it can be used from
// gatsby-node.js (Node) as well as from React components (webpack).
const kebabCase = require('lodash/kebabCase')

/**
 * Returns the URL path of the tag page for `tag`, e.g. "Small Batch" ->
 * "/tags/small-batch/".
 */
function tagPath(tag) {
  return `/tags/${kebabCase(tag)}/`
}

/**
 * Collects the unique, non-empty tags across markdown nodes, preserving the
 * order in which they first appear.
 */
function collectTags(nodes) {
  const tags = new Set()
  for (const node of nodes || []) {
    const nodeTags = node && node.frontmatter && node.frontmatter.tags
    if (!Array.isArray(nodeTags)) continue
    for (const tag of nodeTags) {
      if (typeof tag === 'string' && tag.trim() !== '') tags.add(tag)
    }
  }
  return [...tags]
}

/** Heading of a tag page, e.g. "1 post tagged with “brewing”". */
function tagHeading(totalCount, tag) {
  return `${totalCount} post${totalCount === 1 ? '' : 's'} tagged with “${tag}”`
}

module.exports = { tagPath, collectTags, tagHeading }
