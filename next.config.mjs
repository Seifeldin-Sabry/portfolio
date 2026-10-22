/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [{protocol: "https", hostname: "picsum.photos"}],
    },
    experimental: {
        webpackBuildWorker: true,
        parallelServerBuildTraces: true,
        parallelServerCompiles: true,
    },
}

export default nextConfig