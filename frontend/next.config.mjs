/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // ✅ Remove console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ IMAGES (Cloudinary + Unsplash)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 31536000,
  },

  // ✅ SECURITY HEADERS
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), web-share=(self), fullscreen=(self), autoplay=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;