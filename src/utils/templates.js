// Resolves the page template for a markdown file's `templateKey` frontmatter.
const fs = require('fs')
const path = require('path')

const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates')
const TEMPLATE_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Returns the absolute path of `src/templates/<templateKey>.js`.
 *
 * Throws a descriptive error when the key is missing, is not a simple
 * kebab-case name (which also rules out path traversal such as "../x"), or
 * does not match an existing template file.
 */
function resolveTemplate(templateKey, { source = 'a markdown file' } = {}) {
  if (typeof templateKey !== 'string' || templateKey === '') {
    throw new Error(
      `Missing "templateKey" frontmatter in ${source}. ` +
        'Set it to the name of a file in src/templates (without ".js").'
    )
  }
  if (!TEMPLATE_KEY_PATTERN.test(templateKey)) {
    throw new Error(
      `Invalid templateKey "${templateKey}" in ${source}. ` +
        'Use a lowercase, kebab-case template name such as "blog-post".'
    )
  }
  const templatePath = path.join(TEMPLATES_DIR, `${templateKey}.js`)
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Unknown templateKey "${templateKey}" in ${source}: ` +
        `${path.relative(process.cwd(), templatePath)} does not exist.`
    )
  }
  return templatePath
}

module.exports = { resolveTemplate, TEMPLATES_DIR }
