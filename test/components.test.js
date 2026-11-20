import React from 'react'
import { render, screen, within } from '@testing-library/react'
import Content, { HTMLContent } from '../src/components/Content'
import PreviewCompatibleImage from '../src/components/PreviewCompatibleImage'
import Features from '../src/components/Features'
import Pricing from '../src/components/Pricing'
import Testimonials from '../src/components/Testimonials'
import { BlogRollTemplate } from '../src/components/BlogRoll'

const sharpImage = (src) => ({
  childImageSharp: {
    gatsbyImageData: { images: { fallback: { src } }, width: 10, height: 10 },
  },
})

describe('Content / HTMLContent', () => {
  it('renders React children as-is', () => {
    render(<Content className="c" content={<strong>hi</strong>} />)
    expect(screen.getByText('hi').tagName).toBe('STRONG')
  })

  it('renders an HTML string as markup (not escaped text)', () => {
    const { container } = render(
      <HTMLContent className="content" content="<h2>Title</h2><p>Body</p>" />
    )
    expect(container.querySelector('div.content > h2')).toHaveTextContent(
      'Title'
    )
    expect(screen.queryByText('<h2>Title</h2>')).toBeNull()
  })

  it('renders plain text content escaped', () => {
    render(<Content content="<b>not bold</b>" />)
    expect(screen.getByText('<b>not bold</b>')).toBeInTheDocument()
  })
})

describe('PreviewCompatibleImage', () => {
  it('uses gatsby-plugin-image for sharp-processed images', () => {
    render(
      <PreviewCompatibleImage
        imageInfo={{ image: sharpImage('/static/a.jpg'), alt: 'A' }}
      />
    )
    const img = screen.getByTestId('gatsby-image')
    expect(img).toHaveAttribute('src', '/static/a.jpg')
    expect(img).toHaveAttribute('alt', 'A')
  })

  it('supports childImageSharp at the top level', () => {
    render(
      <PreviewCompatibleImage
        imageInfo={{ ...sharpImage('/static/b.jpg'), alt: 'B' }}
      />
    )
    expect(screen.getByTestId('gatsby-image')).toHaveAttribute(
      'src',
      '/static/b.jpg'
    )
  })

  it('renders a plain <img> for URL strings (CMS preview)', () => {
    render(
      <PreviewCompatibleImage imageInfo={{ image: '/img/c.jpg', alt: 'C' }} />
    )
    const img = screen.getByAltText('C')
    expect(img).toHaveAttribute('src', '/img/c.jpg')
    expect(screen.queryByTestId('gatsby-image')).toBeNull()
  })

  it('renders a plain <img> for Decap asset objects (CMS preview)', () => {
    render(
      <PreviewCompatibleImage
        imageInfo={{ image: { url: 'blob:preview' }, alt: 'D' }}
      />
    )
    expect(screen.getByAltText('D')).toHaveAttribute('src', 'blob:preview')
  })

  it('defaults alt text to empty (decorative) rather than omitting it', () => {
    const { container } = render(
      <PreviewCompatibleImage imageInfo={{ image: '/img/e.jpg' }} />
    )
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })

  it.each([
    ['no image', {}],
    ['an empty string', { image: '' }],
    ['a File node without sharp data', { image: { childImageSharp: null } }],
  ])('renders nothing for %s', (_, imageInfo) => {
    const { container } = render(
      <PreviewCompatibleImage imageInfo={imageInfo} />
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('Features', () => {
  it('renders one column per item with its text and image', () => {
    const { container } = render(
      <Features
        gridItems={[
          { image: '/img/1.png', text: 'First' },
          { image: '/img/2.png', text: 'Second' },
        ]}
      />
    )
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(2)
  })

  it('renders an empty grid without items', () => {
    const { container } = render(<Features />)
    expect(container.querySelector('.columns')).toBeEmptyDOMElement()
  })
})

describe('Pricing', () => {
  it('renders plans with prices and items', () => {
    render(
      <Pricing
        data={[
          { plan: 'Small', price: 50, description: 'Desc', items: ['a', 'b'] },
          { plan: 'Big', price: '80', description: 'More', items: [] },
        ]}
      />
    )
    expect(screen.getByText('$50')).toBeInTheDocument()
    expect(screen.getByText('$80')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('tolerates plans without items (e.g. while editing in the CMS)', () => {
    render(<Pricing data={[{ plan: 'Draft', price: 1 }]} />)
    expect(screen.getByText('Draft')).toBeInTheDocument()
  })

  it('renders duplicate item labels without key collisions', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    render(<Pricing data={[{ plan: 'P', price: 1, items: ['x', 'x'] }]} />)
    expect(screen.getAllByText('x')).toHaveLength(2)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('Testimonials', () => {
  it('renders quotes with their authors', () => {
    render(
      <Testimonials
        testimonials={[
          { quote: 'Great coffee', author: 'Ann' },
          { quote: 'Great coffee', author: 'Bob' },
        ]}
      />
    )
    expect(screen.getAllByText('Great coffee', { exact: false })).toHaveLength(
      2
    )
    expect(screen.getByText(/Bob/)).toBeInTheDocument()
  })

  it('keeps DOM nodes stable across re-renders', () => {
    const items = [{ quote: 'Q', author: 'A' }]
    const { container, rerender } = render(
      <Testimonials testimonials={items} />
    )
    const before = container.querySelector('article')
    rerender(<Testimonials testimonials={items} />)
    expect(container.querySelector('article')).toBe(before)
  })
})

describe('BlogRollTemplate', () => {
  const post = (overrides) => ({
    id: '1',
    excerpt: 'Excerpt',
    fields: { slug: '/blog/one/' },
    frontmatter: {
      title: 'One',
      date: 'January 01, 2020',
      featuredpost: false,
    },
    ...overrides,
  })

  it('links each post to its slug', () => {
    render(<BlogRollTemplate posts={[post()]} />)
    const links = screen.getAllByRole('link')
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/blog/one/',
      '/blog/one/',
    ])
  })

  it('marks featured posts and renders their thumbnail', () => {
    const { container } = render(
      <BlogRollTemplate
        posts={[
          post({
            frontmatter: {
              title: 'Featured',
              featuredpost: true,
              featuredimage: sharpImage('/static/t.jpg'),
            },
          }),
        ]}
      />
    )
    const article = container.querySelector('article')
    expect(article).toHaveClass('is-featured')
    expect(within(article).getByTestId('gatsby-image')).toHaveAttribute(
      'alt',
      'featured image thumbnail for post Featured'
    )
  })

  it('omits the thumbnail when a post has no featured image', () => {
    const { container } = render(<BlogRollTemplate posts={[post()]} />)
    expect(container.querySelector('.featured-thumbnail')).toBeNull()
    expect(container.querySelector('article')).not.toHaveClass('is-featured')
  })

  it('renders nothing for an empty list', () => {
    const { container } = render(<BlogRollTemplate posts={[]} />)
    expect(container.querySelector('article')).toBeNull()
  })
})
