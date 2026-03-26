/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: new URL(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL).hostname,
            port: '',
            pathname: '/sites/default/files/**',
            search: '',
        },
        ],
    },
};

module.exports = nextConfig;
