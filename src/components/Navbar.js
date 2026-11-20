import React, { useState } from 'react'
import { Link } from 'gatsby'
import useSiteMetadata from './SiteMetadata'
import github from '../img/github-icon.svg'
import logo from '../img/logo.svg'

const links = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/contact/examples', label: 'Form Examples' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { repositoryUrl } = useSiteMetadata()
  const activeClass = isOpen ? 'is-active' : ''

  return (
    <nav
      className="navbar is-transparent"
      role="navigation"
      aria-label="main-navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" title="Logo">
            <img src={logo} alt="Kaldi" style={{ width: '88px' }} />
          </Link>
          <button
            type="button"
            className={`navbar-burger burger ${activeClass}`}
            aria-label="menu"
            aria-controls="navMenu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
        <div id="navMenu" className={`navbar-menu ${activeClass}`}>
          <div className="navbar-start has-text-centered">
            {links.map(({ to, label }) => (
              <Link key={to} className="navbar-item" to={to}>
                {label}
              </Link>
            ))}
          </div>
          {repositoryUrl && (
            <div className="navbar-end has-text-centered">
              <a
                className="navbar-item"
                href={repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="icon">
                  <img src={github} alt="GitHub" />
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
