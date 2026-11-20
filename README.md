# Gatsby + Decap CMS Starter

An example business website (the "Kaldi" coffee company) built with
[Gatsby 5](https://www.gatsbyjs.com/) and [Decap CMS](https://decapcms.org/)
(the successor of Netlify CMS), deployed on [Netlify](https://www.netlify.com/).

Content lives as Markdown in this Git repository. Editors change it through the
CMS at `/admin/`, which commits to the repository; Netlify rebuilds and deploys
the site on every commit.

This project derives from
[netlify-templates/gatsby-starter-netlify-cms](https://github.com/netlify-templates/gatsby-starter-netlify-cms).

> **Upgrading from 1.x?** Version 2.0.0 is a major upgrade (Gatsby 2 → 5,
> React 16 → 19, Netlify CMS → Decap CMS, npm instead of Yarn, Node 22+).
> Read the [migration guide](#migrating-from-1x) and the
> [CHANGELOG](CHANGELOG.md) first.

## Features

- Landing, About, Products, Blog and Contact pages, all editable in the CMS
- Blog with tags (one page per tag) and featured posts
- Live CMS previews rendered with the site's own React templates
- Responsive, optimized images with `gatsby-plugin-image`
- [Bulma](https://bulma.io/) styling, with unused CSS removed by PurgeCSS
- [Netlify Forms](https://docs.netlify.com/forms/setup/): a contact form and a
  file-upload form, with spam honeypot and inline error handling
- An example [Netlify Function](https://docs.netlify.com/functions/overview/)
  in `lambda/`
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`) generated for Netlify
- Unit tests (Jest + Testing Library), ESLint, Prettier and GitHub Actions CI

## Requirements

- [Node.js](https://nodejs.org/) 20 or newer (see `.nvmrc`; `nvm use` picks it up)
- npm (ships with Node.js)
- Optional: [Netlify CLI](https://docs.netlify.com/cli/get-started/) to run
  functions locally

## Getting started

```sh
git clone <your-repository-url>
cd gatsby-starter-netlify-cms
npm install
npm run develop
```

The site runs at <http://localhost:8000> and the CMS at
<http://localhost:8000/admin/>.

### Editing content locally

The CMS can edit your local files instead of the remote repository. In a
second terminal, run:

```sh
npm run cms
```

This starts [`decap-server`](https://decapcms.org/docs/working-with-a-local-git-repository/)
on port 8081. Reload <http://localhost:8000/admin/> and click **Login**; changes
are written straight to `src/pages/` and `static/img/`. Commit them with Git as
usual. (`local_backend` is only used on `localhost`.)

### Running the Netlify Function locally

```sh
npx netlify dev
```

Then open <http://localhost:8888/.netlify/functions/hello?name=Kaldi>.

## Scripts

| Command                 | What it does                                               |
| ----------------------- | ---------------------------------------------------------- |
| `npm run develop`       | Clean the cache and start the dev server (alias: `start`)  |
| `npm run build`         | Clean the cache and build the production site to `public/` |
| `npm run serve`         | Serve the production build at <http://localhost:9000>      |
| `npm run cms`           | Start `decap-server` so the local CMS edits local files    |
| `npm test`              | Run the Jest test suite                                    |
| `npm run test:coverage` | Run the tests with a coverage report in `coverage/`        |
| `npm run lint`          | Lint all JavaScript with ESLint                            |
| `npm run format`        | Format the code with Prettier                              |
| `npm run format:check`  | Check formatting without changing files                    |
| `npm run check`         | Lint, format check and tests (what CI runs, minus build)   |
| `npm run clean`         | Delete Gatsby's `.cache/` and `public/`                    |

## Project structure

```text
├── gatsby-config.js        # Site metadata and plugins
├── gatsby-node.js          # Creates a page per Markdown file and per tag
├── gatsby-ssr.js           # Sets <html lang="en">
├── gatsby/                 # Build-time helpers (Decap CMS webpack tweak)
├── lambda/                 # Netlify Functions
├── netlify.toml            # Netlify build settings
├── src/
│   ├── cms/                # CMS entry point and preview templates
│   ├── components/         # Layout, Navbar, Footer, Seo, BlogRoll, ...
│   ├── img/                # Icons and logos imported by components
│   ├── pages/              # Markdown content and file-based pages
│   ├── templates/          # Page templates selected by `templateKey`
│   └── utils/              # Small, tested helpers (tags, forms, images)
├── static/
│   ├── admin/config.yml    # Decap CMS configuration (collections, backend)
│   └── img/                # Media uploaded through the CMS
└── test/                   # Jest tests
```

## How content becomes pages

1. Every Markdown file under `src/pages/` has a `templateKey` in its
   frontmatter, for example `templateKey: blog-post`.
2. `gatsby-node.js` creates one page per file at a path derived from the file
   name (`src/pages/blog/2017-01-04-foo.md` → `/blog/2017-01-04-foo/`) and
   renders it with `src/templates/<templateKey>.js`. An unknown or malformed
   `templateKey` stops the build with a message naming the file.
3. One page per tag is created at `/tags/<tag-in-kebab-case>/`.
4. Image paths such as `/img/chemex.jpg` in frontmatter and Markdown are
   resolved to files in `static/img/` and processed by `sharp`.

To add a new page type, add a template in `src/templates/`, a collection (or
file) in `static/admin/config.yml` whose hidden `templateKey` field defaults to
the template name, and optionally a preview in `src/cms/preview-templates/`
registered in `src/cms/cms.js`. The test suite checks that these stay in sync.

## Deploying to Netlify

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. In Netlify, choose **Add new site → Import an existing project** and pick the
   repository. The build settings come from `netlify.toml`
   (`npm run build`, publish `public/`, Node 22).
3. Enable **Identity** for the site, then under **Identity → Registration**
   choose **Invite only** and invite your editors.
4. Under **Identity → Services**, enable **Git Gateway**.
5. Make sure `backend.branch` in `static/admin/config.yml` matches the branch
   Netlify deploys (`master` by default in this repository).
6. Open `https://<your-site>/admin/`, accept the invite and start editing.

Set the `SITE_URL` environment variable if the site is served from a custom
domain; otherwise the `URL` that Netlify provides is used for canonical and
Open Graph URLs. Update `repositoryUrl` in `gatsby-config.js` to point the
navbar's GitHub icon at your repository.

## Security

Content written in the CMS is rendered as HTML, including any raw HTML in the
Markdown, so **anyone who can edit content can add scripts to the site**. Keep
Netlify Identity registration set to **Invite only** and invite only people
you trust. The CMS preview sanitizes Markdown (`sanitize_preview: true`) so
that editors are not exposed to scripts while previewing. See
[SECURITY.md](SECURITY.md) for details and for how to report a vulnerability.

## Styling

`src/components/all.sass` customizes Bulma 0.9 and is compiled with Dart Sass.
PurgeCSS removes unused Bulma rules at build time (~210 KB → ~22 KB), scanning
the JavaScript in `src/`. Classes that are used **only** inside Markdown
content are not seen by PurgeCSS; add them to a component or configure a
safelist for `gatsby-plugin-purgecss` in `gatsby-config.js`.

Dart Sass prints deprecation warnings for Bulma 0.9's `@import` usage during
builds. They are harmless today; see "Known limitations" below.

## Testing

```sh
npm test
```

The suite covers the page-creation logic (`gatsby-node.js`), template
resolution (including rejection of path traversal in `templateKey`), tag
helpers, form submission (success, HTTP errors, network errors), components,
CMS preview templates, the Netlify Function, and a content check that every
Markdown file, the CMS configuration and the registered previews agree with
each other. CI runs lint, format check, tests and a full build on Node 22
and 24.

## Migrating from 1.x

2.0.0 changes the toolchain and some component APIs. If you started a site from
1.x:

- **Node.js 22+ and npm.** `yarn.lock` was replaced by `package-lock.json`.
  Delete `node_modules/` and run `npm install`. Netlify builds use Node 22 (Node 20 reached end-of-life in April 2026).
- **Netlify CMS → Decap CMS.** `netlify-cms-app` and
  `gatsby-plugin-netlify-cms` were replaced by `decap-cms-app` and
  `gatsby-plugin-decap-cms`. Change `import CMS from 'netlify-cms-app'` to
  `import CMS from 'decap-cms-app'` in your own code. `static/admin/config.yml`
  keeps the same format.
- **Media libraries.** The Uploadcare and Cloudinary media libraries are no
  longer bundled (they were registered but never configured). To use one,
  install `decap-cms-media-library-uploadcare` or
  `decap-cms-media-library-cloudinary`, register it in `src/cms/cms.js` and
  configure it in `config.yml`.
- **Images.** `gatsby-image` was replaced by `gatsby-plugin-image`. GraphQL
  queries use `childImageSharp { gatsbyImageData(...) }` instead of
  `fluid(...) { ...GatsbyImageSharpFluid }`. `PreviewCompatibleImage` keeps the
  same `imageInfo` prop.
- **Document head.** `react-helmet` was replaced by the
  [Gatsby Head API](https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/)
  and the new `Seo` component. `BlogPostTemplate` no longer accepts a `helmet`
  prop; export a `Head` from your page instead. Pages now use their own title
  (for example "About our values") instead of the site title.
- **GraphQL syntax (Gatsby 5).** `sort: { fields: [frontmatter___date], order: DESC }`
  becomes `sort: { frontmatter: { date: DESC } }`, and
  `group(field: frontmatter___tags)` becomes
  `group(field: { frontmatter: { tags: SELECT } })`.
- **`gatsby-remark-relative-images` v2.** `fmImagesToRelative` is gone;
  frontmatter image paths are converted automatically.
- **`templateKey` validation.** Builds now fail with a clear error when a
  Markdown file has a missing or unknown `templateKey`, or one that is not a
  simple kebab-case name.
- **Headers.** The unused root `_headers` file was removed; headers are
  generated by `gatsby-plugin-netlify` (configure them in `gatsby-config.js`).
- **Removed dependencies:** `node-sass` (use `sass`), `uuid`,
  `lodash-webpack-plugin`, `react-helmet`, `gatsby-plugin-react-helmet`.

## Known limitations

- **Remaining advisories.** `npm audit --omit=dev` still reports advisories in
  packages pulled in by Gatsby 5, Decap CMS 3 and `sharp` (mostly build-time
  tooling). They can only be fixed by upstream releases; Dependabot will
  propose updates as they land. See [SECURITY.md](SECURITY.md).
- **React UMD workaround.** Decap CMS 3.8+ requires React 19, which no longer
  ships the UMD files `gatsby-plugin-decap-cms` 4.0.4 expects. The small
  adapter in `gatsby/decap-cms-webpack.js` bundles React and Decap into the
  admin app instead. It can be removed once the plugin supports React 19.
- **Bulma 1.x / Sass modules.** The styles still use Bulma 0.9 with `@import`.
  Moving to Bulma 1.x changes many class names and variables and was left out
  of this release.
- Gatsby prints a Fast Refresh warning for the `*Template` named exports in
  `src/templates/`. They are kept on purpose: the CMS previews reuse them.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

MIT. See [LICENSE](LICENSE).
