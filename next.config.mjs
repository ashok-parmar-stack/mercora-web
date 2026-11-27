import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getApiOrigin() {
  try {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return new URL(process.env.NEXT_PUBLIC_API_URL).origin;
    }
    if (process.env.INTERNAL_BACKEND_URL) {
      return new URL(process.env.INTERNAL_BACKEND_URL).origin;
    }
    return null;
  } catch {
    return null;
  }
}

const apiOrigin = getApiOrigin();
const isDevelopment = process.env.NODE_ENV === 'development';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://checkout.razorpay.com${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.razorpay.com https://*.google.com https://*.googleusercontent.com https://*.neon.tech https://*.aws.neon.tech https://*.amazonaws.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://maps.google.com https://www.google.com https://*.google.com",
  "object-src 'none'",
  `connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://*.neon.tech https://*.aws.neon.tech https://*.amazonaws.com${apiOrigin ? ` ${apiOrigin}` : ''}${isDevelopment ? ' ws: http://localhost:*' : ''}`,
  "media-src 'self' data: blob: https://*.neon.tech https://*.aws.neon.tech https://*.amazonaws.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.neon.tech' },
      { protocol: 'https', hostname: '**.aws.neon.tech' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
    ],
  },
  // Standalone output causes FUNCTION_INVOCATION_FAILED on Vercel Serverless Functions.
  // Only enable standalone mode for Docker / self-hosted container environments.
  output: process.env.VERCEL ? undefined : (process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined),

  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    const rawApiUrl = process.env.INTERNAL_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
    const backendOrigin = rawApiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
