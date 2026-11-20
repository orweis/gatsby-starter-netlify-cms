import React from 'react'
import PropTypes from 'prop-types'
import { withPrefix } from 'gatsby'
import useSiteMetadata from './SiteMetadata'

/**
 * Document <head> tags shared by every page. Render it from a page's
 * `export const Head` (Gatsby Head API).
 */
const Seo = ({ title, description, pathname = '/', children }) => {
  const site = useSiteMetadata()
  const pageTitle = title || site.title
  const pageDescription = description || site.description
  const absolute = (path) => `${site.siteUrl}${withPrefix(path)}`

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={withPrefix('/img/apple-touch-icon.png')}
      />
      <link
        rel="icon"
        type="image/png"
        href={withPrefix('/img/favicon-32x32.png')}
        sizes="32x32"
      />
      <link
        rel="icon"
        type="image/png"
        href={withPrefix('/img/favicon-16x16.png')}
        sizes="16x16"
      />
      <link
        rel="mask-icon"
        href={withPrefix('/img/safari-pinned-tab.svg')}
        color="#ff4400"
      />
      <meta name="theme-color" content="#fff" />

      <meta property="og:type" content="business.business" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={absolute(pathname)} />
      <meta property="og:image" content={absolute('/img/og-image.jpg')} />
      <meta name="twitter:card" content="summary_large_image" />
      {children}
    </>
  )
}

Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  pathname: PropTypes.string,
  children: PropTypes.node,
}

export default Seo
