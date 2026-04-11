/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['172.16.26.98'],
  /**
   * When the browser hits Next on :3000 directly (no nginx), `/api/*` would 404 as HTML.
   * Set API_PROXY_TARGET at build time (see Dockerfile) so those requests forward to Express.
   * Local dev: API_PROXY_TARGET=http://127.0.0.1:5000 in .env.local if you run only `next dev`.
   */
  async rewrites() {
    const target = process.env.API_PROXY_TARGET?.trim().replace(/\/$/, '')
    if (!target) return []
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
