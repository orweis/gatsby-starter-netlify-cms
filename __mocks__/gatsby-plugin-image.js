// Lightweight stand-in for gatsby-plugin-image in unit tests.
const React = require('react')

const getImage = (node) =>
  (node && node.childImageSharp && node.childImageSharp.gatsbyImageData) ||
  (node && node.gatsbyImageData) ||
  undefined

const GatsbyImage = ({ image, alt }) =>
  React.createElement('img', {
    'data-testid': 'gatsby-image',
    src:
      image &&
      image.images &&
      image.images.fallback &&
      image.images.fallback.src,
    alt,
  })

module.exports = { GatsbyImage, getImage }
