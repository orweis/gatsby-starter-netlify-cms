import React from 'react'
import { render, screen } from '@testing-library/react'
import { BlogPostTemplate } from '../src/templates/blog-post'
import { AboutPageTemplate } from '../src/templates/about-page'
import { IndexPageTemplate } from '../src/templates/index-page'
import { ProductPageTemplate } from '../src/templates/product-page'
import { tagHeading } from '../src/utils/tags'
import { HTMLContent } from '../src/components/Content'

jest.mock('../src/components/BlogRoll', () => {
  const BlogRoll = () => <div data-testid="blog-roll" />
  return { __esModule: true, default: BlogRoll }
})

describe('BlogPostTemplate', () => {
  it('renders HTML content and links tags to their pages', () => {
    render(
      <BlogPostTemplate
        title="Hello"
        description="Desc"
        content="<p>Body text</p>"
        contentComponent={HTMLContent}
        tags={['Small Batch', 'coffee']}
      />
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello')
    expect(screen.getByText('Body text').tagName).toBe('P')
    expect(screen.getByRole('link', { name: 'Small Batch' })).toHaveAttribute(
      'href',
      '/tags/small-batch/'
    )
  })

  it('omits the tag list when there are no tags', () => {
    render(<BlogPostTemplate title="T" content="x" tags={[]} />)
    expect(screen.queryByText('Tags')).toBeNull()
  })
})

describe('AboutPageTemplate', () => {
  it('falls back to rendering content as React nodes (CMS preview)', () => {
    render(<AboutPageTemplate title="About" content={<em>preview</em>} />)
    expect(screen.getByText('preview').tagName).toBe('EM')
  })
})

describe('IndexPageTemplate', () => {
  const props = {
    image: '/img/hero.jpg',
    title: 'Title',
    heading: 'Heading',
    subheading: 'Sub',
    description: 'Description',
    mainpitch: { title: 'Pitch', description: 'Pitch description' },
    intro: { blurbs: [{ image: '/img/b.png', text: 'Blurb' }] },
  }

  it('renders the hero background and the blog roll by default', () => {
    const { container } = render(<IndexPageTemplate {...props} />)
    expect(
      container.querySelector('.full-width-image').style.backgroundImage
    ).toBe('url("/img/hero.jpg")')
    expect(screen.getByTestId('blog-roll')).toBeInTheDocument()
    expect(screen.getByText('Blurb')).toBeInTheDocument()
  })

  it('accepts a replacement for the blog roll (used by the CMS preview)', () => {
    render(<IndexPageTemplate {...props} latestStories={<p>placeholder</p>} />)
    expect(screen.queryByTestId('blog-roll')).toBeNull()
    expect(screen.getByText('placeholder')).toBeInTheDocument()
  })

  it('renders with missing optional sections (new CMS entry)', () => {
    render(<IndexPageTemplate title="Only title" latestStories={null} />)
    expect(screen.getByText('Only title')).toBeInTheDocument()
  })
})

describe('ProductPageTemplate', () => {
  it('renders with missing optional sections (new CMS entry)', () => {
    const { container } = render(<ProductPageTemplate title="Products" />)
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(
      container.querySelector('.full-width-image-container').style
        .backgroundImage
    ).toBe('')
  })
})

describe('tagHeading', () => {
  it.each([
    [0, '0 posts tagged with “x”'],
    [1, '1 post tagged with “x”'],
    [2, '2 posts tagged with “x”'],
  ])('pluralizes %i', (count, expected) => {
    expect(tagHeading(count, 'x')).toBe(expected)
  })
})
