// Helpers for submitting Netlify Forms with fetch.
// See https://docs.netlify.com/forms/setup/#submit-javascript-rendered-forms-with-ajax

/** URL-encodes a flat object as `application/x-www-form-urlencoded`. */
export function encodeForm(data) {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&')
}

/** Builds a multipart FormData body (needed for file uploads). */
export function toFormData(data) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null) formData.append(key, value)
  }
  return formData
}

/**
 * POSTs a form submission to Netlify. Resolves on a 2xx response and rejects
 * otherwise (fetch itself only rejects on network failures).
 */
export async function submitForm(body, { headers } = {}) {
  const response = await fetch('/', { method: 'POST', headers, body })
  if (!response.ok) {
    throw new Error(
      `Form submission failed (HTTP ${response.status}). Please try again.`
    )
  }
  return response
}
