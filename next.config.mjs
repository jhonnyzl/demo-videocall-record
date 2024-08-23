/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/testimonios/:path*',
                destination: '/testimonios/:path*',
            },
        ];
    },
};

export default nextConfig;
