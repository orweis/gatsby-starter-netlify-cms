import React from 'react'
import { render, screen } from '@testing-library/react'
import BlogPostPreview from '../src/cms/preview-templates/BlogPostPreview'
import IndexPagePreview from '../src/cms/preview-templates/IndexPagePreview'
import ProductPagePreview from '../src/cms/preview-templates/ProductPagePreview'
import AboutPagePreview from '../src/cms/preview-templates/AboutPagePreview'

jest.mock('../src/components/BlogRoll', () => {
  const BlogRoll = () => {
    throw new Error(
      'BlogRoll needs a static query and must not render in the CMS'
    )
  }
  return { __esModule: true, default: BlogRoll }
})

// Minimal stand-in for the Immutable.js entry Decap passes to previews.
const toImmutable = (value) => {
  if (Array.isArray(value)) {
    return { toJS: () => value, map: (fn) => value.map(fn) }
  }
  return value
}
const makeEntry = (data) => ({
  getIn: (keys) => {
    if (keys.length === 1 && keys[0] === 'data') return { toJS: () => data }
    const value = keys
      .slice(1)
      .reduce((acc, key) => (acc == null ? acc : acc[key]), data)
    return toImmutable(value)
  },
})
const getAsset = (path) =>
  path ? { url: `asset:${path}`, toString: () => `asset:${path}` } : path
const widgetFor = (name) => <div data-testid={`widget-${name}`} />

describe('CMS preview templates', () => {
  it('BlogPostPreview passes tags and the body widget', () => {
    render(
      <BlogPostPreview
        entry={makeEntry({ title: 'Post', description: 'D', tags: ['a', 'b'] })}
        widgetFor={widgetFor}
      />
    )
    expect(screen.getByText('Post')).toBeInTheDocument()
    expect(screen.getByTestId('widget-body')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'b' })).toHaveAttribute(
      'href',
      '/tags/b/'
    )
  })

  it('BlogPostPreview works for a new post without tags', () => {
    render(
      <BlogPostPreview
        entry={makeEntry({ title: 'New' })}
        widgetFor={widgetFor}
      />
    )
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('AboutPagePreview renders the title and body', () => {
    render(
      <AboutPagePreview
        entry={makeEntry({ title: 'About' })}
        widgetFor={widgetFor}
      />
    )
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByTestId('widget-body')).toBeInTheDocument()
  })

  it('IndexPagePreview renders without the blog roll static query', () => {
    const { container } = render(
      <IndexPagePreview
        entry={makeEntry({ title: 'Home', image: '/img/home.jpg' })}
        getAsset={getAsset}
      />
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(
      screen.getByText(/latest blog posts are listed here/i)
    ).toBeInTheDocument()
    expect(
      container.querySelector('.full-width-image').style.backgroundImage
    ).toBe('url("asset:/img/home.jpg")')
  })

  it('ProductPagePreview resolves every image through getAsset', () => {
    const { container } = render(
      <ProductPagePreview
        entry={makeEntry({
          title: 'Products',
          image: '/img/top.jpg',
          full_image: '/img/full.jpg',
          intro: { blurbs: [{ image: '/img/blurb.png', text: 'Blurb' }] },
          main: {
            heading: 'Main',
            image1: { image: '/img/1.jpg', alt: 'one' },
            image2: { image: '/img/2.jpg', alt: 'two' },
            image3: { image: '/img/3.jpg', alt: 'three' },
          },
          testimonials: [{ quote: 'Nice', author: 'Ann' }],
          pricing: {
            heading: 'Prices',
            plans: [{ plan: 'P', price: 1, items: ['x'] }],
          },
        })}
        getAsset={getAsset}
      />
    )
    expect(screen.getByAltText('one')).toHaveAttribute(
      'src',
      'asset:/img/1.jpg'
    )
    expect(screen.getByAltText('three')).toHaveAttribute(
      'src',
      'asset:/img/3.jpg'
    )
    const backgrounds = [
      ...container.querySelectorAll('.full-width-image-container'),
    ].map((el) => el.style.backgroundImage)
    expect(backgrounds).toEqual([
      'url("asset:/img/top.jpg")',
      'url("asset:/img/full.jpg")',
    ])
    expect(screen.getByText(/Nice/)).toBeInTheDocument()
  })

  it('ProductPagePreview renders an empty new entry', () => {
    render(<ProductPagePreview entry={makeEntry({})} getAsset={getAsset} />)
    expect(document.querySelector('.content')).toBeInTheDocument()
  })
})
