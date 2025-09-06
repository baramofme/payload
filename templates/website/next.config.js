import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    // Allow requests from your development serve
    // 'localhost' default value
    '192.168.45.181', // Example if you're accessing from a specific IP
    'ts.mezeet.com',
    '*.ts.mezeet.com'
    // Add other origins as needed, e.g., 'https://your-domain.com'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'payload.ts.mezeet.com',
        port: '',
        pathname: '/api/media/file/**'
      },
      {
        protocol: 'https',
        hostname: 'paydev.ts.mezeet.com',
        port: '',
        pathname: '/api/media/file/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/api/media/file/**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/media/file/**'
      },
      // NEXT_PUBLIC_SERVER_URL이 있다면 해당 도메인도 허용
      ...(NEXT_PUBLIC_SERVER_URL && NEXT_PUBLIC_SERVER_URL.startsWith('http')
        ? [new URL(NEXT_PUBLIC_SERVER_URL).hostname].map((hostname) => ({
            protocol: new URL(NEXT_PUBLIC_SERVER_URL).protocol.replace(':', ''),
            hostname: hostname,
          }))
        : []),
    ],
    // 이미지 품질을 명시적으로 설정하여 경고를 제거합니다.
    // 퀄리티 값을 배열로 지정해 Next.js가 자동으로 최적의 품질을 선택하게 합니다.
    qualities: [75, 80, 85, 90, 95, 100],
  },
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
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
