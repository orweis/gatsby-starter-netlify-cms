import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useStaticQuery } from 'gatsby'
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'
import Seo from '../src/components/Seo'

const siteMetadata = {
  title: 'Site Title',
  description: 'Site description',
  siteUrl: 'https://example.com',
  repositoryUrl: 'https://github.com/example/repo',
}

beforeEach(() => {
  useStaticQuery.mockReturnValue({ site: { siteMetadata } })
})

describe('Navbar', () => {
  it('toggles the mobile menu and reflects state in aria-expanded', () => {
    const { container } = render(<Navbar />)
    const burger = screen.getByRole('button', { name: 'menu' })
    const menu = container.querySelector('#navMenu')

    expect(burger).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('is-active')

    fireEvent.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
    expect(burger).toHaveClass('is-active')
    expect(menu).toHaveClass('is-active')

    fireEvent.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    expect(menu).not.toHaveClass('is-active')
  })

  it('links to the configured repository in a new tab without leaking the opener', () => {
    render(<Navbar />)
    const link = screen.getByRole('link', { name: 'GitHub' })
    expect(link).toHaveAttribute('href', siteMetadata.repositoryUrl)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')).toMatch(/noopener/)
    expect(link.getAttribute('rel')).toMatch(/noreferrer/)
  })

  it('hides the repository link when none is configured', () => {
    useStaticQuery.mockReturnValue({
      site: { siteMetadata: { ...siteMetadata, repositoryUrl: null } },
    })
    render(<Navbar />)
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull()
  })
})

describe('Footer', () => {
  it('gives every external/new-tab link rel="noopener noreferrer"', () => {
    const { container } = render(<Footer />)
    const blankLinks = container.querySelectorAll('a[target="_blank"]')
    expect(blankLinks.length).toBeGreaterThan(0)
    blankLinks.forEach((a) => {
      expect(a.getAttribute('rel')).toMatch(/noopener/)
    })
  })

  it('labels social icons for assistive technology', () => {
    render(<Footer />)
    for (const name of ['Facebook', 'Twitter', 'Instagram', 'Vimeo']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument()
    }
  })
})

describe('Seo', () => {
  // React 19 hoists <title>, <meta> and <link> into document.head.
  const metaContent = (selector) =>
    document.head.querySelector(selector).getAttribute('content')

  it('falls back to site metadata', () => {
    render(<Seo />)
    expect(document.head.querySelector('title')).toHaveTextContent('Site Title')
    expect(metaContent('meta[name="description"]')).toBe('Site description')
    expect(metaContent('meta[property="og:url"]')).toBe('https://example.com/')
  })

  it('uses page values and absolute Open Graph URLs', () => {
    render(
      <Seo
        title="Post | Blog"
        description="About a post"
        pathname="/blog/post/"
      >
        <meta property="og:type" content="article" />
      </Seo>
    )
    expect(document.head.querySelector('title')).toHaveTextContent(
      'Post | Blog'
    )
    expect(metaContent('meta[property="og:title"]')).toBe('Post | Blog')
    expect(metaContent('meta[property="og:url"]')).toBe(
      'https://example.com/blog/post/'
    )
    expect(metaContent('meta[property="og:image"]')).toBe(
      'https://example.com/img/og-image.jpg'
    )
    expect(
      document.head.querySelectorAll('meta[property="og:type"]')
    ).toHaveLength(2)
  })
})
