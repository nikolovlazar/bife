/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/app',
        destination: '/app/links',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
