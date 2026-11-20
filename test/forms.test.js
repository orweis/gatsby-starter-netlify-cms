import { encodeForm, toFormData, submitForm } from '../src/utils/forms'

describe('encodeForm', () => {
  it('URL-encodes keys and values', () => {
    expect(
      encodeForm({ 'form-name': 'contact', message: 'a&b=c d', ünï: 'çödé' })
    ).toBe(
      'form-name=contact&message=a%26b%3Dc%20d&%C3%BCn%C3%AF=%C3%A7%C3%B6d%C3%A9'
    )
  })

  it('skips undefined and null values instead of sending "undefined"', () => {
    expect(encodeForm({ a: undefined, b: null, c: 0, d: '' })).toBe('c=0&d=')
  })

  it('returns an empty string for an empty object', () => {
    expect(encodeForm({})).toBe('')
  })
})

describe('toFormData', () => {
  it('appends values and files, skipping empty ones', () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })
    const data = toFormData({
      name: 'Ada',
      attachment: file,
      missing: undefined,
    })
    expect(data.get('name')).toBe('Ada')
    expect(data.get('attachment')).toBeInstanceOf(File)
    expect(data.get('attachment').name).toBe('hello.txt')
    expect(data.has('missing')).toBe(false)
  })
})

describe('submitForm', () => {
  afterEach(() => {
    delete global.fetch
  })

  it('POSTs to / and resolves on success', async () => {
    const response = { ok: true, status: 200 }
    global.fetch = jest.fn().mockResolvedValue(response)
    await expect(
      submitForm('a=1', { headers: { 'Content-Type': 'x' } })
    ).resolves.toBe(response)
    expect(global.fetch).toHaveBeenCalledWith('/', {
      method: 'POST',
      headers: { 'Content-Type': 'x' },
      body: 'a=1',
    })
  })

  it('rejects on non-2xx responses (fetch itself would resolve)', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 })
    await expect(submitForm('a=1')).rejects.toThrow(/HTTP 404/)
  })

  it('propagates network errors', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(submitForm('a=1')).rejects.toThrow('Failed to fetch')
  })
})
