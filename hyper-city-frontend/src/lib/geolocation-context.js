/**
 * Geolocation requires a secure context: HTTPS or http://localhost (not http:// + public IP).
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
 */

/** @returns {'insecure' | 'unsupported' | null} */
export function getGeolocationBlockReason() {
  if (typeof window === 'undefined') return null
  if (!('geolocation' in navigator)) return 'unsupported'
  if (!window.isSecureContext) return 'insecure'
  return null
}

export const GEO_BLOCK_MESSAGES = {
  insecure:
    'Location is blocked: browsers only allow GPS on HTTPS (or localhost), not on http:// with an IP. Use your HTTPS domain, or browse by city below.',
  unsupported: 'This browser does not support geolocation.',
}
