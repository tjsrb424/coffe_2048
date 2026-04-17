import Image from "next/image";
import { LobbyScreen } from "@/features/lobby/components/LobbyScreen";

export default function LobbyPage() {
  // NOTE: `next/image`는 basePath/assetPrefix를 자동 적용한다.
  // 여기서 수동으로 prefix를 붙이면 배포 환경에서 경로가 중복되어 404 → 흰 배경처럼 보일 수 있다.
  const bgSrc = "/images/lobby/coffee-shop-bg.png";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={bgSrc}
          alt="로비 배경"
          fill
          priority
          sizes="100vw"
          className="object-cover blur-sm"
          style={{ transform: "scale(1.03)" }}
        />
        <div className="absolute inset-0 bg-cream-100/40" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-coffee-900/12 via-cream-100/10 to-coffee-900/12"
          aria-hidden
        />
      </div>

      <div className="relative z-10">
        <LobbyScreen />
      </div>
    </div>
  );
}
