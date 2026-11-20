import React from 'react'
import PropTypes from 'prop-types'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const imageStyle = { borderRadius: '5px' }

/**
 * Renders an image both on the built site and in the CMS preview.
 *
 * - On the site, `image` (or `childImageSharp`) is processed by sharp and
 *   rendered with gatsby-plugin-image.
 * - In the CMS preview, `image` is a URL string or a Decap asset object with a
 *   `url` property, rendered with a plain <img>.
 */
const PreviewCompatibleImage = ({ imageInfo }) => {
  const { alt = '', childImageSharp, image } = imageInfo

  const sharpImage =
    getImage(image && image.childImageSharp ? image : null) ||
    getImage(childImageSharp ? { childImageSharp } : null)
  if (sharpImage) {
    return <GatsbyImage image={sharpImage} style={imageStyle} alt={alt} />
  }

  if (typeof image === 'string' && image !== '') {
    return <img style={imageStyle} src={image} alt={alt} />
  }

  if (image && typeof image.url === 'string' && image.url !== '') {
    return <img style={imageStyle} src={image.url} alt={alt} />
  }

  return null
}

PreviewCompatibleImage.propTypes = {
  imageInfo: PropTypes.shape({
    alt: PropTypes.string,
    childImageSharp: PropTypes.object,
    image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }).isRequired,
}

export default PreviewCompatibleImage
