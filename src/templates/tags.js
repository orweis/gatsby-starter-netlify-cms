import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import Seo from '../components/Seo'
import { tagHeading } from '../utils/tags'

export const Head = ({ data, pageContext, location }) => (
  <Seo
    title={`${pageContext.tag} | ${data.site.siteMetadata.title}`}
    pathname={location.pathname}
  />
)

Head.propTypes = {
  data: PropTypes.object,
  pageContext: PropTypes.object,
  location: PropTypes.object,
}

const TagRoute = ({ data, pageContext }) => {
  const { nodes: posts, totalCount } = data.allMarkdownRemark

  return (
    <Layout>
      <section className="section">
        <div className="container content">
          <div className="columns">
            <div
              className="column is-10 is-offset-1"
              style={{ marginBottom: '6rem' }}
            >
              <h3 className="title is-size-4 is-bold-light">
                {tagHeading(totalCount, pageContext.tag)}
              </h3>
              <ul className="taglist">
                {posts.map((post) => (
                  <li key={post.fields.slug}>
                    <Link to={post.fields.slug}>
                      <h2 className="is-size-2">{post.frontmatter.title}</h2>
                    </Link>
                  </li>
                ))}
              </ul>
              <p>
                <Link to="/tags/">Browse all tags</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

TagRoute.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number,
      nodes: PropTypes.array,
    }),
  }).isRequired,
  pageContext: PropTypes.shape({ tag: PropTypes.string }).isRequired,
}

export default TagRoute

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
        }
      }
    }
  }
`
