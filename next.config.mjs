import webpack from 'webpack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/app',
        destination: '/app/collections',
        permanent: true,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'require("reflect-metadata");',
          raw: true,
          entryOnly: true,
          exclude: ['./middleware.ts'],
        })
      )
    }
    return config
  },
}

export default nextConfig
