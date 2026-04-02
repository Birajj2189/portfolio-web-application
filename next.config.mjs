/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Proxy /api/auth/* → your cloud auth server so cookies stay same-origin.
  // Set AUTH_SERVICE_URL in Vercel env vars (server-side only, no NEXT_PUBLIC_).
  // e.g. AUTH_SERVICE_URL=http://74.220.48.x:3001
  async rewrites() {
    const authBase = process.env.AUTH_SERVICE_URL
    if (!authBase) return []
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authBase}/auth/:path*`,
      },
    ]
  },
}

export default nextConfig
