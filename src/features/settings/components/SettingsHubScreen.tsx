"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { useAppStore } from "@/stores/useAppStore";

export function SettingsHubScreen() {
  useResetDocumentScrollOnMount();
  const settings = useAppStore((s) => s.settings);
  const patch = useAppStore((s) => s.patchSettings);
  const { lightTap } = useGameFeedback();

  return (
    <>
      <AppShell>
        <header className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            Settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-coffee-900">설정</h1>
          <p className="mt-2 text-sm leading-relaxed text-coffee-700">
            사운드·햅틱·모션은 여기서 조용히 맞춰요.
          </p>
        </header>

        <Card className="mb-4 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-coffee-600/60">
            웹 상점
          </div>
          <p className="mt-2 text-sm text-coffee-800">
            테마·광고 제거 등 placeholder 결제는 상점 화면에서 테스트해요.
          </p>
          <Link
            href="/shop"
            className="mt-3 inline-block text-sm font-semibold text-coffee-900 underline-offset-2 hover:underline"
            onClick={() => lightTap()}
          >
            상점 열기
          </Link>
        </Card>

        <Card className="space-y-3">
          <ToggleRow
            label="사운드"
            description="효과음 재생 (후속 연결 지점)"
            checked={settings.soundOn}
            onChange={(v) => patch({ soundOn: v })}
            onTap={lightTap}
          />
          <ToggleRow
            label="진동"
            description="가벼운 햅틱 피드백"
            checked={settings.vibrationOn}
            onChange={(v) => patch({ vibrationOn: v })}
            onTap={lightTap}
          />
          <ToggleRow
            label="모션 줄이기"
            description="애니메이션을 덜 사용해요"
            checked={settings.reducedMotion}
            onChange={(v) => patch({ reducedMotion: v })}
            onTap={lightTap}
          />
        </Card>
      </AppShell>
    </>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  onTap,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  onTap: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-cream-200/60 px-3 py-3 ring-1 ring-coffee-600/5">
      <div>
        <div className="text-sm font-semibold text-coffee-900">{label}</div>
        <div className="mt-1 text-xs text-coffee-700">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => {
          onTap();
          onChange(!checked);
        }}
        className={`flex h-9 w-16 items-center rounded-full p-1 transition-colors ${
          checked ? "justify-end bg-coffee-600" : "justify-start bg-cream-300"
        }`}
      >
        <span className="block h-7 w-7 rounded-full bg-cream-50 shadow-sm" />
      </button>
    </div>
  );
}
