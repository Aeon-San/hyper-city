/** Resolves public API prefix; avoids `/` or empty values producing `/auth/...` instead of `/api/auth/...`. */
export function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL
  if (raw == null || raw === '' || raw === '/') {
    return '/api'
  }
  return raw.replace(/\/$/, '') || '/api'
}
