# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.0 - 2026-11-20

A major upgrade of the whole toolchain. See the
[migration guide](README.md#migrating-from-1x) in the README.

### Breaking changes

- Requires Node.js 20 or newer (`engines`, `.nvmrc`, Netlify `NODE_VERSION`
  were Node 12).
- npm replaces Yarn: `yarn.lock` was removed in favor of `package-lock.json`.
- Gatsby 2 → 5 and React 16 → 19. GraphQL queries use the Gatsby 5 `sort` and
  `group` syntax.
- Netlify CMS → Decap CMS (`decap-cms-app` 3, `gatsby-plugin-decap-cms` 4).
- `gatsby-image` → `gatsby-plugin-image` (`gatsbyImageData` in queries).
- `react-helmet` → Gatsby Head API with a new `Seo` component.
  `BlogPostTemplate` no longer accepts a `helmet` prop.
- The Uploadcare and Cloudinary media libraries are no longer bundled.
- `gatsby-remark-relative-images` 0.3 → 2 (`fmImagesToRelative` removed).
- The build fails with a descriptive error when a Markdown file has a missing,
  malformed or unknown `templateKey`.
- `node-sass` → `sass` (Dart Sass); `uuid`, `lodash-webpack-plugin` and
  `react-helmet` were removed.

### Security

- Upgraded away from end-of-life Gatsby 2, webpack 4, node-sass and Node 12:
  `npm audit` advisories went from 1,064 (74 critical) to 62 production
  advisories with no critical ones. The remainder needs upstream fixes.
- `gatsby-transformer-remark` 6 includes the fix for CVE-2023-22491.
- `templateKey` is validated, so frontmatter cannot point the build at
  arbitrary files (e.g. `../../x`).
- CMS Markdown previews are sanitized (`sanitize_preview: true`).
- Security headers are added to every page, including `Permissions-Policy`.
  The root `_headers` file, which Netlify never published, was removed.
- The example function no longer logs query-string parameters, validates the
  HTTP method and returns proper JSON headers.
- `.gitignore` now ignores `.env*` files.
- Replaced the obsolete Dependabot v1 config (which auto-merged updates) and
  the remote Renovate preset with `.github/dependabot.yml` (no auto-merge).
- Added `SECURITY.md` describing the trust model and how to report issues.

### Added

- Jest + Testing Library test suite (`npm test`), including a content check
  that Markdown, `config.yml` and CMS previews stay consistent.
- ESLint (flat config), Prettier config, `.editorconfig`, `.nvmrc`.
- GitHub Actions CI (lint, format, tests, build on Node 20 and 22) with pinned
  actions and read-only permissions.
- `npm run cms` (local CMS editing with `decap-server`, `local_backend: true`),
  `npm run serve`, `npm run check`, `npm run test:coverage`.
- `siteUrl` and `repositoryUrl` site metadata; absolute Open Graph URLs,
  `og:description` and a Twitter card.

### Changed

- Pages use their own title in `<title>` (previously most used the site title).
- Contact forms show an inline error and stay on the page when the submission
  fails (previously non-2xx responses still went to the thank-you page and
  network errors used `alert()`).
- The mobile navbar toggle is a `<button>` with `aria-expanded`.
- CMS previews of the product page now show `main.image1`–`image3` and the
  full-width image; the landing page preview no longer crashes on the blog roll.
- Components rewritten as function components; `gatsby-node.js` uses
  async/await and small tested helpers in `src/utils/`.
- README, CONTRIBUTING and PR template updated; PR template moved to
  `.github/`.

### Fixed

- Typo in the site description.
- Random React keys in `Testimonials` caused every item to remount on render.

## 1.1.3

Last release based on Gatsby 2 and Netlify CMS 2.
