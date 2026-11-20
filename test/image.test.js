import { getImageSrc, backgroundImage } from '../src/utils/image'

const sharpNode = (src) => ({
  childImageSharp: { gatsbyImageData: { images: { fallback: { src } } } },
})

describe('getImageSrc', () => {
  it.each([
    ['a URL string', '/img/a.jpg', '/img/a.jpg'],
    [
      'a sharp-processed File node',
      sharpNode('/static/x/a.jpg'),
      '/static/x/a.jpg',
    ],
    [
      'a Decap asset proxy',
      { url: 'blob:abc', toString: () => 'blob:abc' },
      'blob:abc',
    ],
    ['null', null, ''],
    ['undefined', undefined, ''],
    ['an empty string', '', ''],
    ['a node without image data', { childImageSharp: null }, ''],
    [
      'a sharp node without fallback',
      { childImageSharp: { gatsbyImageData: { images: {} } } },
      '',
    ],
  ])('handles %s', (_, input, expected) => {
    expect(getImageSrc(input)).toBe(expected)
  })
})

describe('backgroundImage', () => {
  it('returns a quoted CSS url()', () => {
    expect(backgroundImage('/img/a b.jpg')).toBe('url("/img/a b.jpg")')
  })

  it('escapes quotes so a path cannot break out of url()', () => {
    expect(backgroundImage('/img/a").jpg')).toBe('url("/img/a\\").jpg")')
  })

  it('returns undefined when there is no image', () => {
    expect(backgroundImage(null)).toBeUndefined()
  })
})
