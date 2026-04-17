/**
 * GitHub Pages용 정적 export 빌드.
 * `output: "export"`는 `next dev`와 함께 쓰면 에러 컴포넌트 로딩 이슈가 날 수 있어
 * 설정에서 조건부로만 켠다. 이 스크립트는 그 플래그를 켠 뒤 `next build`를 실행한다.
 */
import { spawnSync } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(root, "node_modules/next/dist/bin/next");
const env = { ...process.env, NEXT_STATIC_EXPORT: "true" };
const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env,
  cwd: root,
});
process.exit(result.status ?? 1);
