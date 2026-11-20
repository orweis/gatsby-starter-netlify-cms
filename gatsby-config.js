// Gatsby site configuration.
// See https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
const { customizeDecapWebpackConfig } = require('./gatsby/decap-cms-webpack')

// Absolute URL of the deployed site, used for canonical and Open Graph URLs.
// Netlify sets `URL` automatically during builds; set `SITE_URL` to override.
const siteUrl = (
  process.env.SITE_URL ||
  process.env.URL ||
  'http://localhost:8000'
).replace(/\/+$/, '')

module.exports = {
  siteMetadata: {
    title: 'Gatsby + Decap CMS Starter',
    description:
      'This repo contains an example business website that is built with Gatsby and Decap CMS. It follows the Jamstack architecture by using Git as a single source of truth, and Netlify for continuous deployment and CDN distribution.',
    siteUrl,
    // Shown as the GitHub icon in the navbar. Point it at your own repository.
    repositoryUrl:
      'https://github.com/netlify-templates/gatsby-starter-netlify-cms',
  },
  plugins: [
    // Compiles src/**/*.sass with Dart Sass. Bulma 0.9 triggers Dart Sass
    // deprecation warnings (@import etc.) during builds; they are harmless
    // until the styles are migrated to Bulma 1.x / Sass modules.
    'gatsby-plugin-sass',
    {
      // Keep this as the first gatsby-source-filesystem entry: images uploaded
      // through the CMS must be File nodes before markdown is transformed so
      // frontmatter image paths can be resolved to gatsby-plugin-image data.
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/img`,
        name: 'uploads',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/img`,
        name: 'images',
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          // Rewrites `/img/...` paths (the CMS `public_folder`) in markdown and
          // frontmatter to paths relative to the markdown file, so that
          // gatsby-remark-images and gatsby-plugin-image can process them.
          // Must run before gatsby-remark-images.
          'gatsby-remark-relative-images',
          {
            resolve: 'gatsby-remark-images',
            options: {
              // Width (in px) of the content container; used as the base for
              // the generated responsive image sizes.
              maxWidth: 2048,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
            options: {
              // Linked non-image files are copied to public/static/.
              destinationDir: 'static',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-decap-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
        // Bundle React/Decap instead of loading UMD globals (see the file).
        customizeWebpackConfig: customizeDecapWebpackConfig,
      },
    },
    {
      // Removes unused Bulma rules from the bundled CSS. Only all.sass is
      // purged; classes that exist only in markdown/CMS content must be
      // safelisted (see README "Styling").
      resolve: 'gatsby-plugin-purgecss',
      options: {
        develop: true,
        purgeOnly: ['/all.sass'],
      },
    }, // must be after other CSS plugins
    {
      // Generates public/_headers for Netlify. Besides long-lived caching for
      // hashed assets, the plugin adds X-Frame-Options: DENY,
      // X-Content-Type-Options: nosniff and Referrer-Policy: same-origin to
      // every path by default; the headers below are added on top.
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {
          '/*': [
            'Permissions-Policy: camera=(), microphone=(), geolocation=()',
          ],
        },
      },
    }, // keep last in the array
  ],
}
