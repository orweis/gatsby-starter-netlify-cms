import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import Layout from '../../components/Layout'
import Seo from '../../components/Seo'
import { encodeForm, submitForm } from '../../utils/forms'

export const Head = ({ location }) => (
  <Seo title="Contact" pathname={location.pathname} />
)

Head.propTypes = { location: PropTypes.object }

const ContactPage = () => {
  const [values, setValues] = useState({})
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    setError(null)
    setIsSubmitting(true)
    try {
      await submitForm(
        encodeForm({ 'form-name': form.getAttribute('name'), ...values }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
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
            <h1>Contact</h1>
            <form
              name="contact"
              method="post"
              action="/contact/thanks/"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
              <input type="hidden" name="form-name" value="contact" />
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
                <label className="label" htmlFor="email">
                  Email
                </label>
                <div className="control">
                  <input
                    className="input"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    id="email"
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="message">
                  Message
                </label>
                <div className="control">
                  <textarea
                    className="textarea"
                    name="message"
                    onChange={handleChange}
                    id="message"
                    required
                  />
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

export default ContactPage
