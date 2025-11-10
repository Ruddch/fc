import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Если репозиторий не называется username.github.io, раскомментируйте и укажите имя репозитория:
  // basePath: process.env.NODE_ENV === 'production' ? '/имя-репозитория' : '',
  // trailingSlash: true,
};

export default nextConfig;
