import { Suspense } from "react";
import Image from "next/image";
import { LobbyScreen } from "@/features/lobby/components/LobbyScreen";

function LobbyLoadingFallback() {
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-3 px-4 pb-10 pt-6 sm:pb-12">
      <div
        className="h-8 w-8 animate-pulse rounded-full bg-coffee-600/20"
        aria-hidden
      />
      <p className="text-sm text-coffee-700">로비를 불러오는 중…</p>
    </div>
  );
}

export default function LobbyPage() {
  // NOTE: `next/image`는 basePath/assetPrefix를 자동 적용한다.
  // 여기서 수동으로 prefix를 붙이면 배포 환경에서 경로가 중복되어 404 → 흰 배경처럼 보일 수 있다.
  const bgSrc = "/images/lobby/coffee-shop-bg.png";

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={bgSrc}
          alt="로비 배경"
          fill
          priority
          sizes="100vw"
          className="object-cover blur-[1.5px]"
          style={{ transform: "scale(1.02)" }}
        />
        <div className="absolute inset-0 bg-cream-100/22" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-coffee-900/14 via-transparent to-coffee-900/10"
          aria-hidden
        />
      </div>

      <Suspense fallback={<LobbyLoadingFallback />}>
        <LobbyScreen />
      </Suspense>
    </div>
  );
}
