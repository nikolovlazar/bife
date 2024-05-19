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
}

export default nextConfig
