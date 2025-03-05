/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "tailwindui.com",
      "res.cloudinary.com"
    ]
  },
  experimental: {
    serverActions: true
  }
}

module.exports = nextConfig
