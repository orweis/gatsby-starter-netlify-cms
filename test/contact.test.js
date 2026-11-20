import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { navigate, useStaticQuery } from 'gatsby'
import ContactPage from '../src/pages/contact/index'
import FileUploadPage from '../src/pages/contact/file-upload'

beforeEach(() => {
  useStaticQuery.mockReturnValue({
    site: {
      siteMetadata: {
        title: 'T',
        description: 'D',
        siteUrl: '',
        repositoryUrl: '',
      },
    },
  })
  navigate.mockClear()
})

afterEach(() => {
  delete global.fetch
})

const fill = (label, value) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

describe('Contact page', () => {
  it('keeps the attributes Netlify needs to detect the form', () => {
    const { container } = render(<ContactPage />)
    const form = container.querySelector('form')
    expect(form).toHaveAttribute('name', 'contact')
    expect(form).toHaveAttribute('data-netlify', 'true')
    expect(form).toHaveAttribute('data-netlify-honeypot', 'bot-field')
    expect(container.querySelector('input[name="form-name"]')).toHaveValue(
      'contact'
    )
  })

  it('submits URL-encoded values and navigates to the thank-you page', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 })
    render(<ContactPage />)
    fill('Your name', 'Ada & Co')
    fill('Email', 'ada@example.com')
    fill('Message', 'Hi')
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/contact/thanks/')
    )
    const [url, options] = global.fetch.mock.calls[0]
    expect(url).toBe('/')
    expect(options.headers).toEqual({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    expect(new URLSearchParams(options.body).get('name')).toBe('Ada & Co')
    expect(new URLSearchParams(options.body).get('form-name')).toBe('contact')
  })

  it('shows an inline error and stays on the page when Netlify rejects the submission', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 })
    render(<ContactPage />)
    fill('Your name', 'Ada')
    fill('Email', 'ada@example.com')
    fill('Message', 'Hi')
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 500')
    expect(navigate).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled()
  })
})

describe('File upload page', () => {
  it('sends multipart data without forcing a Content-Type header', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200 })
    const { container } = render(<FileUploadPage />)
    fill('Your name', 'Ada')
    const file = new File(['data'], 'notes.txt', { type: 'text/plain' })
    fireEvent.change(container.querySelector('input[type="file"]'), {
      target: { files: [file] },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith('/contact/thanks/')
    )
    const [, options] = global.fetch.mock.calls[0]
    expect(options.headers).toBeUndefined()
    expect(options.body).toBeInstanceOf(FormData)
    expect(options.body.get('form-name')).toBe('file-upload')
    expect(options.body.get('attachment').name).toBe('notes.txt')
  })

  it('shows network errors inline', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    render(<FileUploadPage />)
    fill('Your name', 'Ada')
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Failed to fetch'
    )
  })
})
