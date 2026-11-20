/** @jest-environment node */
const { handler } = require('../lambda/hello')

const call = (event) => handler({ httpMethod: 'GET', ...event })

describe('hello function', () => {
  it('returns JSON with a default greeting', async () => {
    const res = await call({ queryStringParameters: null })
    expect(res.statusCode).toBe(200)
    expect(res.headers['Content-Type']).toMatch(/^application\/json/)
    expect(JSON.parse(res.body)).toEqual({ msg: 'Hello, World!' })
  })

  it('greets by name, trimmed and length-limited', async () => {
    const res = await call({
      queryStringParameters: { name: `  ${'x'.repeat(80)}  ` },
    })
    expect(JSON.parse(res.body).msg).toBe(`Hello, ${'x'.repeat(50)}!`)
  })

  it('treats a blank name as missing', async () => {
    const res = await call({ queryStringParameters: { name: '   ' } })
    expect(JSON.parse(res.body).msg).toBe('Hello, World!')
  })

  it('returns valid JSON for names containing quotes or markup', async () => {
    const res = await call({ queryStringParameters: { name: '"</script><b>' } })
    expect(JSON.parse(res.body).msg).toBe('Hello, "</script><b>!')
  })

  it.each(['POST', 'PUT', 'DELETE'])(
    'rejects %s with 405 and an Allow header',
    async (method) => {
      const res = await call({ httpMethod: method })
      expect(res.statusCode).toBe(405)
      expect(res.headers.Allow).toBe('GET')
    }
  )

  it('does not log request data', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {})
    await call({ queryStringParameters: { token: 'secret' } })
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
