/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'database.cadavrexquis.ca',
            port: '',
            pathname: '/sites/default/files/**',
            search: '',
        },
        ],
    },
};

module.exports = nextConfig;
