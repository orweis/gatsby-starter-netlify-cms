import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'

export const Head = ({ location }) => (
  <Seo title="Form examples" pathname={location.pathname} />
)

Head.propTypes = { location: PropTypes.object }

const FormExamplesPage = () => (
  <Layout>
    <section className="section">
      <div className="container">
        <div className="content">
          <h1>Hi people</h1>
          <p>
            This is an example site integrating Netlify’s form handling with
            Gatsby
          </p>
          <ul>
            <li>
              <Link to="/contact">Basic contact form</Link>
            </li>
            <li>
              <Link to="/contact/file-upload/">Form with file upload</Link>
            </li>
          </ul>

          <h2>Troubleshooting</h2>
          <h3>Forms are not detected by Netlify</h3>
          <p>
            Netlify detects forms by parsing the pre-rendered HTML at deploy
            time. Make sure form detection is enabled for the site and that
            every form keeps its <code>data-netlify=&quot;true&quot;</code>{' '}
            attribute and hidden <code>form-name</code> input. See the{' '}
            <a href="https://docs.netlify.com/forms/setup/">
              Netlify Forms documentation
            </a>
            .
          </p>
          <h3>Adding reCAPTCHA</h3>
          <p>
            Netlify Forms support reCAPTCHA 2 out of the box; see{' '}
            <a href="https://docs.netlify.com/forms/spam-filters/">
              spam filters
            </a>{' '}
            in the Netlify docs.
          </p>
        </div>
      </div>
    </section>
  </Layout>
)

export default FormExamplesPage
