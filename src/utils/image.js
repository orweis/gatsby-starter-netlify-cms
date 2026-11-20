/**
 * Returns a plain URL for an image value as it appears either in GraphQL data
 * (a File node with `childImageSharp.gatsbyImageData`) or in the CMS preview
 * (a URL string, or a Decap asset object exposing `url`). Returns an empty
 * string when no URL can be derived.
 */
export function getImageSrc(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  const fallback =
    image.childImageSharp &&
    image.childImageSharp.gatsbyImageData &&
    image.childImageSharp.gatsbyImageData.images &&
    image.childImageSharp.gatsbyImageData.images.fallback
  if (fallback && fallback.src) return fallback.src
  if (typeof image.url === 'string') return image.url
  return ''
}

/** CSS `background-image` value for `image`, or `undefined` when empty. */
export function backgroundImage(image) {
  const src = getImageSrc(image)
  return src ? `url(${JSON.stringify(src)})` : undefined
}
