/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'yazilimgelistirici.subu.edu.tr',
      },
      {
        protocol: 'https',
        hostname: 'www.ofisimo.com',
      },
      {
        protocol: 'https',
        hostname: 'cloudmi.storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sgstechnologies.net',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      }
    ],
  },
  experimental: {
    // ServerActions varsayılan olarak etkin olduğundan kaldırıldı
  },
}

module.exports = nextConfig 