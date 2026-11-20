import React from 'react'
import PropTypes from 'prop-types'

/**
 * Renders an HTML string produced at build time by gatsby-transformer-remark.
 *
 * Security note: markdown may contain raw HTML, which is rendered as-is.
 * Only trusted people should be able to edit content (see SECURITY.md).
 */
export const HTMLContent = ({ content, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
)

/** Renders React content, e.g. the CMS preview's `widgetFor('body')`. */
const Content = ({ content, className }) => (
  <div className={className}>{content}</div>
)

Content.propTypes = {
  content: PropTypes.node,
  className: PropTypes.string,
}

HTMLContent.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
}

export default Content
