/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DEFAULT_FEDERATION_ID:
      process.env.NEXT_PUBLIC_DEFAULT_FEDERATION_ID,
    NEXT_PUBLIC_DEFAULT_FEDERATION_NAME:
      process.env.NEXT_PUBLIC_DEFAULT_FEDERATION_NAME,
    NEXT_PUBLIC_DEFAULT_FEDERATION_NETWORK:
      process.env.NEXT_PUBLIC_DEFAULT_FEDERATION_NETWORK,
  },
};

export default nextConfig;
