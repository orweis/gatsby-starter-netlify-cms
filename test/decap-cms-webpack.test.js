/** @jest-environment node */
const { customizeDecapWebpackConfig } = require('../gatsby/decap-cms-webpack')

class CopyPlugin {
  constructor(patterns) {
    this.patterns = patterns
  }
}
class HtmlWebpackTagsPlugin {
  constructor(scripts) {
    this.options = {
      scripts,
      scriptsPrepend: scripts,
      scriptsAppend: [],
    }
  }
}
class OtherPlugin {}

const makeConfig = () => ({
  externals: [
    { 'netlify-identity-widget': 'netlifyIdentity' },
    { react: 'React' },
    { 'react-dom': 'ReactDOM' },
    { 'decap-cms-app': 'DecapCmsApp' },
  ],
  plugins: [
    new CopyPlugin([
      {
        from: '/nm/netlify-identity-widget/build/netlify-identity.js',
        to: 'netlify-identity.js',
      },
      {
        from: '/nm/react/umd/react.production.min.js',
        to: 'react.production.min.js',
      },
      {
        from: '/nm/react-dom/umd/react-dom.production.min.js',
        to: 'react-dom.production.min.js',
      },
      {
        from: '/nm/decap-cms-app/dist/decap-cms-app.js',
        to: 'decap-cms-app.js',
      },
      {
        from: '/nm/decap-cms-app/dist/decap-cms-app.js.map',
        to: 'decap-cms-app.js.map',
      },
    ]),
    new HtmlWebpackTagsPlugin([
      { path: 'netlify-identity.js' },
      { path: 'react.production.min.js' },
      { path: 'react-dom.production.min.js' },
      { path: 'decap-cms-app.js' },
    ]),
    new OtherPlugin(),
    false,
  ],
})

describe('customizeDecapWebpackConfig', () => {
  it('bundles React and Decap instead of loading UMD globals', () => {
    const config = customizeDecapWebpackConfig(makeConfig())
    expect(config.externals).toEqual([
      { 'netlify-identity-widget': 'netlifyIdentity' },
    ])
  })

  it('stops copying the UMD files (React 19 has none) but keeps the identity widget', () => {
    const config = customizeDecapWebpackConfig(makeConfig())
    expect(config.plugins[0].patterns.map((p) => p.to)).toEqual([
      'netlify-identity.js',
    ])
  })

  it('removes the matching <script> tags from the admin page', () => {
    const config = customizeDecapWebpackConfig(makeConfig())
    const { options } = config.plugins[1]
    expect(options.scripts).toEqual([{ path: 'netlify-identity.js' }])
    expect(options.scriptsPrepend).toEqual([{ path: 'netlify-identity.js' }])
    expect(options.scriptsAppend).toEqual([])
  })

  it('leaves unrelated plugins untouched and tolerates missing fields', () => {
    const other = new OtherPlugin()
    const config = customizeDecapWebpackConfig({ plugins: [other] })
    expect(config.plugins).toEqual([other])
    expect(config.externals).toBeUndefined()
  })
})
