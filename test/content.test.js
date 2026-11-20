/** @jest-environment node */
// Validates the repository's content and CMS configuration, so that a typo in
// markdown frontmatter or static/admin/config.yml fails CI instead of the
// Netlify deploy (or, worse, silently breaking the CMS).
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const { resolveTemplate } = require('../src/utils/templates')

const ROOT = path.resolve(__dirname, '..')
const PAGES_DIR = path.join(ROOT, 'src', 'pages')
const STATIC_DIR = path.join(ROOT, 'static')

const listMarkdown = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listMarkdown(full)
    return entry.name.endsWith('.md') ? [full] : []
  })

const readFrontmatter = (file) => {
  const match = fs
    .readFileSync(file, 'utf8')
    .match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) throw new Error(`${file} has no frontmatter block`)
  return yaml.load(match[1])
}

// Collects every string value under `value` that looks like an uploaded image.
const imagePaths = (value) => {
  if (typeof value === 'string') {
    return /^\/img\/.+\.(png|jpe?g|gif|svg|webp)$/i.test(value) ? [value] : []
  }
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(imagePaths)
  }
  return []
}

const cmsConfig = yaml.load(
  fs.readFileSync(path.join(STATIC_DIR, 'admin', 'config.yml'), 'utf8')
)
const markdownFiles = listMarkdown(PAGES_DIR)
const fieldsOf = (entry) => entry.fields || []
// Every editable entry: folder collections and the files of file collections.
const entries = cmsConfig.collections.flatMap((collection) =>
  collection.files
    ? collection.files.map((file) => ({ collection, entry: file }))
    : [{ collection, entry: collection }]
)
const rel = (file) => path.relative(ROOT, file)

describe('markdown content', () => {
  it('exists', () => {
    expect(markdownFiles.length).toBeGreaterThan(0)
  })

  describe.each(markdownFiles.map((file) => [rel(file), file]))(
    '%s',
    (_, file) => {
      const frontmatter = readFrontmatter(file)

      it('has a templateKey that maps to a template file', () => {
        expect(() =>
          resolveTemplate(frontmatter.templateKey, { source: rel(file) })
        ).not.toThrow()
      })

      it('only references images that exist in static/', () => {
        for (const image of imagePaths(frontmatter)) {
          expect(fs.existsSync(path.join(STATIC_DIR, image))).toBe(true)
        }
      })

      it('has a title', () => {
        expect(typeof frontmatter.title).toBe('string')
        expect(frontmatter.title.trim()).not.toBe('')
      })
    }
  )

  it('gives blog posts a valid date and a list of tags', () => {
    const posts = markdownFiles
      .map(readFrontmatter)
      .filter((fm) => fm.templateKey === 'blog-post')
    expect(posts.length).toBeGreaterThan(0)
    for (const post of posts) {
      expect(Number.isNaN(new Date(post.date).getTime())).toBe(false)
      expect(Array.isArray(post.tags ?? [])).toBe(true)
    }
  })
})

describe('static/admin/config.yml', () => {
  it('uses a git-based backend with a branch', () => {
    expect(cmsConfig.backend.name).toBe('git-gateway')
    expect(typeof cmsConfig.backend.branch).toBe('string')
  })

  it('stores media in a folder served at public_folder', () => {
    expect(cmsConfig.media_folder).toBe('static/img')
    expect(cmsConfig.public_folder).toBe('/img')
    expect(fs.existsSync(path.join(ROOT, cmsConfig.media_folder))).toBe(true)
  })

  it('points every collection at existing content', () => {
    for (const { collection, entry } of entries) {
      const target = collection.folder || entry.file
      expect(fs.existsSync(path.join(ROOT, target))).toBe(true)
    }
  })

  it('defaults every templateKey field to an existing template', () => {
    for (const { entry } of entries) {
      const field = fieldsOf(entry).find((f) => f.name === 'templateKey')
      expect(field).toBeDefined()
      expect(field.widget).toBe('hidden')
      expect(() => resolveTemplate(field.default)).not.toThrow()
    }
  })

  it('sanitizes markdown previews to protect editors from injected scripts', () => {
    const markdownFields = entries.flatMap(({ entry }) =>
      fieldsOf(entry).filter((f) => f.widget === 'markdown')
    )
    expect(markdownFields.length).toBeGreaterThan(0)
    for (const field of markdownFields) {
      expect(field.sanitize_preview).toBe(true)
    }
  })

  it('matches the templateKey of each single-file page', () => {
    for (const { collection, entry } of entries) {
      if (!collection.files) continue
      const field = fieldsOf(entry).find((f) => f.name === 'templateKey')
      const frontmatter = readFrontmatter(path.join(ROOT, entry.file))
      expect(frontmatter.templateKey).toBe(field.default)
    }
  })
})

describe('preview registrations', () => {
  it('registers a preview for every CMS collection/file name', () => {
    const cmsSource = fs.readFileSync(
      path.join(ROOT, 'src', 'cms', 'cms.js'),
      'utf8'
    )
    const registered = [
      ...cmsSource.matchAll(/registerPreviewTemplate\('([^']+)'/g),
    ].map((m) => m[1])
    const names = entries.map(({ entry }) => entry.name)
    for (const name of registered) expect(names).toContain(name)
  })
})
