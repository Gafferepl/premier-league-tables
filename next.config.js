/** @type {import('next').NextConfig} */

const nextConfig = {
  // Prevent MD files from being served as pages
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Iron-clad security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
      {
        // Block access to documentation directories
        source: '/docs/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, nosnippet, noarchive' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
      {
        // Block access to private directories
        source: '/.private/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, nosnippet, noarchive' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ];
  },
  
  // Disable directory listing
  trailingSlash: false,
  
  // Prevent build-time access to private files
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Exclude private directories from build
    config.module.rules.push({
      test: /\.(md|txt)$/,
      issuer: /\.(js|jsx|ts|tsx)$/,
      use: 'null-loader',
    });
    
    return config;
  },
  
  // Environment-based security
  env: {
    CUSTOM_SECURITY_KEY: process.env.CUSTOM_SECURITY_KEY,
  },
  
  // Image optimization security
  images: {
    domains: ['thegafferEPL.com'],
    unoptimized: false,
  },
  
  // Experimental security features
  experimental: {
    // Prevent server-side access to sensitive files
    serverComponentsExternalPackages: ['.private', 'docs/internal'],
  },
};

module.exports = nextConfig;
