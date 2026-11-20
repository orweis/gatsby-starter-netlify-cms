import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql, useStaticQuery } from 'gatsby'
import PreviewCompatibleImage from './PreviewCompatibleImage'

/** List of blog post cards. Exported separately for testing. */
export const BlogRollTemplate = ({ posts = [] }) => (
  <div className="columns is-multiline">
    {posts.map((post) => (
      <div className="is-parent column is-6" key={post.id}>
        <article
          className={`blog-list-item tile is-child box notification ${
            post.frontmatter.featuredpost ? 'is-featured' : ''
          }`}
        >
          <header>
            {post.frontmatter.featuredimage ? (
              <div className="featured-thumbnail">
                <PreviewCompatibleImage
                  imageInfo={{
                    image: post.frontmatter.featuredimage,
                    alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                  }}
                />
              </div>
            ) : null}
            <p className="post-meta">
              <Link
                className="title has-text-primary is-size-4"
                to={post.fields.slug}
              >
                {post.frontmatter.title}
              </Link>
              <span> &bull; </span>
              <span className="subtitle is-size-5 is-block">
                {post.frontmatter.date}
              </span>
            </p>
          </header>
          <p>
            {post.excerpt}
            <br />
            <br />
            <Link className="button" to={post.fields.slug}>
              Keep Reading →
            </Link>
          </p>
        </article>
      </div>
    ))}
  </div>
)

BlogRollTemplate.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      fields: PropTypes.shape({ slug: PropTypes.string }),
      frontmatter: PropTypes.object,
    })
  ),
}

const BlogRoll = () => {
  const data = useStaticQuery(graphql`
    query BlogRollQuery {
      allMarkdownRemark(
        sort: { frontmatter: { date: DESC } }
        filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
      ) {
        nodes {
          excerpt(pruneLength: 400)
          id
          fields {
            slug
          }
          frontmatter {
            title
            templateKey
            date(formatString: "MMMM DD, YYYY")
            featuredpost
            featuredimage {
              childImageSharp {
                gatsbyImageData(width: 120, quality: 100, layout: CONSTRAINED)
              }
            }
          }
        }
      }
    }
  `)
  return <BlogRollTemplate posts={data.allMarkdownRemark.nodes} />
}

export default BlogRoll
