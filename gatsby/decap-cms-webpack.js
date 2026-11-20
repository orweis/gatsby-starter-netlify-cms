// Adjusts the webpack config that gatsby-plugin-decap-cms uses for /admin/.
//
// By default the plugin loads React, ReactDOM and decap-cms-app as browser
// globals from prebuilt UMD files. React 19 (required by decap-cms-app 3.8+)
// no longer ships UMD builds, so those files do not exist and the build fails.
// Instead we let webpack bundle these packages like any other dependency.
// The Netlify Identity widget is still loaded the plugin's default way.

const BUNDLED_PACKAGES = ['react', 'react-dom', 'decap-cms-app']
const BUNDLED_ASSETS = [
  'react.production.min.js',
  'react-dom.production.min.js',
  'decap-cms-app.js',
  'decap-cms-app.js.map',
]

const isBundledAsset = (file) =>
  typeof file === 'string' &&
  BUNDLED_ASSETS.some(
    (asset) =>
      file === asset ||
      file.endsWith(`/${asset}`) ||
      file.endsWith(`\\${asset}`)
  )

function customizeDecapWebpackConfig(config) {
  if (Array.isArray(config.externals)) {
    config.externals = config.externals.filter(
      (external) =>
        !BUNDLED_PACKAGES.some((name) =>
          Object.prototype.hasOwnProperty.call(external, name)
        )
    )
  }

  for (const plugin of config.plugins || []) {
    const name = plugin && plugin.constructor && plugin.constructor.name

    if (name === 'CopyPlugin' && Array.isArray(plugin.patterns)) {
      plugin.patterns = plugin.patterns.filter(
        (pattern) => !isBundledAsset(pattern.to)
      )
    }

    if (name === 'HtmlWebpackTagsPlugin' && plugin.options) {
      for (const key of ['scripts', 'scriptsPrepend', 'scriptsAppend']) {
        if (Array.isArray(plugin.options[key])) {
          plugin.options[key] = plugin.options[key].filter(
            (tag) => !isBundledAsset(tag.path)
          )
        }
      }
    }
  }

  return config
}

module.exports = { customizeDecapWebpackConfig, BUNDLED_PACKAGES }
