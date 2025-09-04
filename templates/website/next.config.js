import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['https://payload.ts.mezeet.com'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'payload.ts.mezeet.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      // NEXT_PUBLIC_SERVER_URL이 있다면 해당 도메인도 허용
      ...(NEXT_PUBLIC_SERVER_URL && NEXT_PUBLIC_SERVER_URL.startsWith('http')
        ? [new URL(NEXT_PUBLIC_SERVER_URL).hostname].map((hostname) => {
            const url = new URL(hostname)
    
            return {
              hostname: url.hostname,
              protocol: url.protocol.replace(':', ''),
            }
          })
        : []),
    ],
  },
  webpack: (webpackConfig, {isServer}) => {
    webpackConfig.stats = {
      reasons: true,
      chunks: true,
      modules: true,
      source: true,
      assets: true
    }

    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
