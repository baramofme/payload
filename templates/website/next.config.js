import path from 'path';
import { fileURLToPath } from 'url';
import { withPayload } from '@payloadcms/next/withPayload'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined || process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL ,/* 'https://example.com' */
      'http://192.168.45.181:4000', /* 새로운 URL을 직접 추가 */
      ].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  webpack: (webpackConfig, {isServer}) => {
    /* 
    if (!isServer) {
       webpackConfig.cache = {
          type: 'filesystem',
          cacheDirectory: path.resolve(__dirname, './node_modules/.next/cache'),
       }
    } 
    */
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
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
