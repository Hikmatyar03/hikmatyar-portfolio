/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Pexels — CC0 placeholder images (About section photo)
      { protocol: "https", hostname: "images.pexels.com" },
      // Sanity CDN — production image assets
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
};

export default nextConfig;
