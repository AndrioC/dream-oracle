import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
  publicRuntimeConfig: {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  },
  images: {
    domains: ['lapvgfedxtpyywssaahn.supabase.co'],
  },
};

export default withNextIntl(nextConfig);
