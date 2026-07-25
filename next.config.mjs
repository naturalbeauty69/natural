/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image's default optimizer needs a Node server; Cloudflare Workers
    // doesn't provide one. Unoptimized for now — swap to Cloudflare Images
    // or a custom loader in a later phase if on-the-fly resizing is needed.
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
