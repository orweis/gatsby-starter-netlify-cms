// Example Netlify Function, served at /.netlify/functions/hello
// Docs: https://docs.netlify.com/functions/get-started/
//
// Call it from the site, for example:
//   fetch('/.netlify/functions/hello?name=Kaldi').then((res) => res.json())

const MAX_NAME_LENGTH = 50

const json = (statusCode, payload, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders,
  },
  body: JSON.stringify(payload),
})

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') {
    return json(405, { error: 'Method Not Allowed' }, { Allow: 'GET' })
  }

  // Never log raw query parameters: they may carry tokens or personal data.
  const params = event.queryStringParameters || {}
  const name =
    typeof params.name === 'string' && params.name.trim() !== ''
      ? params.name.trim().slice(0, MAX_NAME_LENGTH)
      : 'World'

  return json(200, { msg: `Hello, ${name}!` })
}
