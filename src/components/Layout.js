import React from 'react'
import PropTypes from 'prop-types'
import Footer from './Footer'
import Navbar from './Navbar'
import './all.sass'

/** Page chrome (navbar + footer). Head tags live in ./Seo.js. */
const Layout = ({ children }) => (
  <div>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
)

Layout.propTypes = {
  children: PropTypes.node,
}

export default Layout
