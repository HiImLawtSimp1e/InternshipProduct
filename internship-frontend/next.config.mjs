import path from "path";
import CopyPlugin from "copy-webpack-plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), "node_modules/tinymce/skins"),
            to: path.join(process.cwd(), "public/assets/libs/tinymce/skins"),
          },
        ],
      })
    );
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
  images: {
    domains: ["res.cloudinary.com", "upload.wikimedia.org"],
  },
};

export default nextConfig;
