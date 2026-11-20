import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'
import { submitForm, toFormData } from '../../utils/forms'

export const Head = ({ location }) => (
  <Seo title="File upload" pathname={location.pathname} />
)

Head.propTypes = { location: PropTypes.object }

const FileUploadPage = () => {
  const [values, setValues] = useState({})
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleAttachment = (e) => {
    const { name, files } = e.target
    setValues((current) => ({ ...current, [name]: files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    setError(null)
    setIsSubmitting(true)
    try {
      // No Content-Type header: the browser sets the multipart boundary.
      await submitForm(
        toFormData({ 'form-name': form.getAttribute('name'), ...values })
      )
      navigate(form.getAttribute('action'))
    } catch (err) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <section className="section">
        <div className="container">
          <div className="content">
            <h1>File Upload</h1>
            <form
              name="file-upload"
              method="post"
              action="/contact/thanks/"
              encType="multipart/form-data"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="file-upload" />
              <div hidden>
                <label>
                  Don’t fill this out:{' '}
                  <input name="bot-field" onChange={handleChange} />
                </label>
              </div>
              <div className="field">
                <label className="label" htmlFor="name">
                  Your name
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="name"
                    onChange={handleChange}
                    id="name"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <div className="file">
                  <label className="file-label">
                    <input
                      className="file-input"
                      type="file"
                      name="attachment"
                      onChange={handleAttachment}
                    />
                    <span className="file-cta">
                      <span className="file-label">Choose a file…</span>
                    </span>
                  </label>
                </div>
              </div>
              {error && (
                <p className="notification is-danger" role="alert">
                  {error}
                </p>
              )}
              <div className="field">
                <button
                  className="button is-link"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default FileUploadPage
