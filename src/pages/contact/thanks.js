import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'

export const Head = ({ location }) => (
  <Seo title="Thank you" pathname={location.pathname} />
)

Head.propTypes = { location: PropTypes.object }

const ThanksPage = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <h1>Thank you!</h1>
          <p>This is a custom thank you page for form submissions</p>
        </div>
      </div>
    </section>
  </Layout>
)

export default ThanksPage
