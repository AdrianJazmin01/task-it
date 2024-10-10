/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "taskit-s3-pics.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ]
  }
};


export default nextConfig;
