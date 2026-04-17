import type { NextConfig } from "next";

// GitHub Pages 프로젝트 사이트: 저장소 이름과 동일한 하위 경로
const githubPagesBasePath = "/coffe_2048";
// CI에서 명시하면 GITHUB_ACTIONS 여부와 무관하게 동일한 base로 빌드됨
const deployedBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH?.trim() ||
  (process.env.GITHUB_ACTIONS === "true" ? githubPagesBasePath : "");

/** `output: "export"`를 항상 켜면 `next dev`에서 "missing required error components" 등이 날 수 있음 */
const enableStaticExport =
  process.env.NEXT_STATIC_EXPORT === "true" ||
  process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.50.8"],
  ...(enableStaticExport ? { output: "export" as const } : {}),
  basePath: deployedBasePath,
  assetPrefix: deployedBasePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: deployedBasePath,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  // Windows에서 dev 중 `.next` 매니페스트 경합(ENOENT/MODULE_NOT_FOUND) 완화
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
