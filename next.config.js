/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  headers: async () => {
    return [
      {
        source: "/onnx/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          },
          {
            key: "Content-Type",
            value: "application/wasm"
          }
        ],
      },
    ];
  },
};

export default nextConfig;