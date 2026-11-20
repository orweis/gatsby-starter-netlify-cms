// Manual mock of the `gatsby` package for Jest.
// https://www.gatsbyjs.com/docs/how-to/testing/unit-testing/#3-useful-mocks-to-complete-your-testing-environment
const React = require('react')

module.exports = {
  graphql: jest.fn(),
  Link: jest.fn().mockImplementation(
    // Drop Gatsby-only props so they are not passed to the DOM.
    ({
      activeClassName,
      activeStyle,
      getProps,
      innerRef,
      partiallyActive,
      replace,
      to,
      ...rest
    }) => React.createElement('a', { ...rest, href: to })
  ),
  navigate: jest.fn(),
  useStaticQuery: jest.fn(),
  withPrefix: jest.fn((path) => path),
}
