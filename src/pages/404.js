import React from 'react'
import Layout from '../components/Layout'
import Seo from '../components/Seo'

export const Head = () => <Seo title="404: Not found" />

const NotFoundPage = () => (
  <Layout>
    <section className="section">
      <div className="container content">
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage
