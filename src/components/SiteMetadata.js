import { graphql, useStaticQuery } from 'gatsby'

/** Returns `siteMetadata` from gatsby-config.js. */
const useSiteMetadata = () => {
  const { site } = useStaticQuery(graphql`
    query SITE_METADATA_QUERY {
      site {
        siteMetadata {
          title
          description
          siteUrl
          repositoryUrl
        }
      }
    }
  `)
  return site.siteMetadata
}

export default useSiteMetadata
