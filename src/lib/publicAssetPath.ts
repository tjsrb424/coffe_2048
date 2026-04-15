/**
 * `public/` 정적 파일 URL. GitHub Pages 등 `basePath` 배포에서도 올바른 절대 경로를 만듦.
 * (HTMLAudioElement·Image 등 Next가 자동으로 prefix 하지 않는 경우에 사용)
 */
export function publicAssetPath(path: string): string {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
