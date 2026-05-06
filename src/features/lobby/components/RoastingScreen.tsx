"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";

type RoastLevel = "light" | "medium" | "dark";
type RoastingStatus = "idle" | "roasting" | "complete";

type BeanItem = {
  id: string;
  name: string;
  shortName: string;
  imageSrc: string;
  rarity: number;
  tags: string[];
  description: string;
};

const ROASTING_ASSETS = {
  reference: "/assets/roasting/reference/roasting_final_reference.png",
  background: "/assets/roasting/roasting_bg.png",
  beanEthiopia: "/assets/roasting/bean_ethiopia_yirgacheffe.png",
  beanBrazil: "/assets/roasting/bean_brazil_santos.png",
  beanColombia: "/assets/roasting/bean_colombia_supremo.png",
  starsOn: "/assets/roasting/bean_rating_stars_on.png",
  starsOff: "/assets/roasting/bean_rating_stars_off.png",
  selectedBeanInfoPanel: "/assets/roasting/selected_bean_info_panel-1.png",
  selectionPanel: "/assets/roasting/selected_bean_info_panel.png",
  selectedCheckBadge: "/assets/roasting/selected_check_badge.png",
  startButton: "/assets/roasting/roasting_start_button.png",
  progressPanel: "/assets/roasting/roasting_progress_panel.png",
  storageButton: "/assets/roasting/selected_check_badge.png",
  completedBeansButton: "/assets/roasting/completed_beans_button.png",
} as const;

const BEANS: BeanItem[] = [
  {
    id: "ethiopia_yirgacheffe",
    name: "에티오피아 예가체프",
    shortName: "에티오피아",
    imageSrc: ROASTING_ASSETS.beanEthiopia,
    rarity: 3,
    tags: ["플로럴", "시트러스", "산뜻함"],
    description: "밝은 향과 산뜻한 여운이 살아나는 원두예요.",
  },
  {
    id: "brazil_santos",
    name: "브라질 산토스",
    shortName: "브라질",
    imageSrc: ROASTING_ASSETS.beanBrazil,
    rarity: 2,
    tags: ["고소함", "묵직함", "부드러움"],
    description: "고소하고 안정적인 바디감이 좋은 원두예요.",
  },
  {
    id: "colombia_supremo",
    name: "콜롬비아 수프리모",
    shortName: "콜롬비아",
    imageSrc: ROASTING_ASSETS.beanColombia,
    rarity: 3,
    tags: ["균형감", "달콤함", "깔끔함"],
    description: "향과 단맛이 균형 있게 어울리는 원두예요.",
  },
];

const ROAST_LEVELS: Array<{
  id: RoastLevel;
  label: string;
  beanTone: string;
  durationSeconds: number;
  description: string;
}> = [
  {
    id: "light",
    label: "연하게",
    beanTone: "#b98558",
    durationSeconds: 10,
    description: "향을 가볍게",
  },
  {
    id: "medium",
    label: "중간",
    beanTone: "#8a5635",
    durationSeconds: 14,
    description: "균형 있게",
  },
  {
    id: "dark",
    label: "진하게",
    beanTone: "#4d2f20",
    durationSeconds: 18,
    description: "묵직하게",
  },
];

export function RoastingScreen() {
  useResetDocumentScrollOnMount();

  const [selectedBeanId, setSelectedBeanId] = useState(BEANS[0]!.id);
  const [selectedRoastLevel, setSelectedRoastLevel] =
    useState<RoastLevel>("medium");
  const [status, setStatus] = useState<RoastingStatus>("idle");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const resources = useAppStore((s) => s.playerResources);
  const cafe = useAppStore((s) => s.cafeState);
  const roastOnce = useAppStore((s) => s.roastOnce);

  const runtime = getCafeRuntimeModifiers(cafe);
  const selectedBean = useMemo(
    () => BEANS.find((bean) => bean.id === selectedBeanId) ?? BEANS[0]!,
    [selectedBeanId],
  );
  const selectedLevel = useMemo(
    () =>
      ROAST_LEVELS.find((level) => level.id === selectedRoastLevel) ??
      ROAST_LEVELS[1]!,
    [selectedRoastLevel],
  );

  const finishAt = startedAt
    ? startedAt + selectedLevel.durationSeconds * 1000
    : null;
  const remainingMs =
    status === "roasting" && finishAt ? Math.max(0, finishAt - now) : 0;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const progressPercent =
    status === "complete"
      ? 100
      : startedAt && finishAt
        ? Math.min(
            100,
            Math.max(0, Math.round(((now - startedAt) / (finishAt - startedAt)) * 100)),
          )
        : 0;
  const canStart =
    status === "idle" &&
    resources.beans >= runtime.roastBeanCost &&
    cafe.espressoShots < runtime.maxShots;

  useEffect(() => {
    if (status !== "roasting") return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === "roasting" && finishAt && now >= finishAt) {
      setStatus("complete");
    }
  }, [finishAt, now, status]);

  const handleStartButton = () => {
    if (status === "roasting") return;
    if (status === "complete") {
      const didRoast = roastOnce();
      if (didRoast) {
        setStatus("idle");
        setStartedAt(null);
      }
      return;
    }
    if (!canStart) return;
    const started = Date.now();
    setStartedAt(started);
    setNow(started);
    setStatus("roasting");
  };

  return (
    <RoastingBackground>
      <RoastingHeader
        coins={resources.coins}
        beans={resources.beans}
        hearts={resources.hearts}
      />

      <main className="relative z-10 mx-auto h-[100dvh] w-full max-w-md overflow-hidden px-3 pt-[calc(env(safe-area-inset-top)+1px)] text-[#4f3322]">
        <SelectedBeanInfoPanel bean={selectedBean} />

        <BeanSelectionRoastPanel
          beans={BEANS}
          selectedBeanId={selectedBeanId}
          stock={resources.beans}
          selectedRoastLevel={selectedRoastLevel}
          isRoasting={status === "roasting"}
          onSelectBean={setSelectedBeanId}
          onSelectLevel={setSelectedRoastLevel}
        />

        <RoastingStartButton
          status={status}
          canStart={canStart}
          onClick={handleStartButton}
        />

        <RoastingProgressPanel
          status={status}
          remainingSeconds={remainingSeconds}
          progressPercent={progressPercent}
          roastCost={runtime.roastBeanCost}
          shotYield={runtime.shotYield}
          maxShots={runtime.maxShots}
          currentShots={cafe.espressoShots}
        />
      </main>

      <RoastingBottomActions />
    </RoastingBackground>
  );
}

function RoastingBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="roasting-background relative h-[100dvh] overflow-hidden bg-[#bfe3ee]"
      data-asset-path={ROASTING_ASSETS.background}
    >
      <Image
        src={ROASTING_ASSETS.background}
        alt=""
        width={852}
        height={1846}
        priority
        sizes="auto"
        className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2 object-contain"
      />
      {children}
    </div>
  );
}

function RoastingHeader({
  coins,
  beans,
  hearts,
}: {
  coins: number;
  beans: number;
  hearts: number;
}) {
  return (
    <header className="roasting-header fixed inset-x-0 top-0 z-30 mx-auto flex h-[62px] max-w-md items-start justify-between px-3 pt-[calc(env(safe-area-inset-top)+8px)]">
      <RoastingBackButton />
      <RoastingCurrencyHud coins={coins} beans={beans} hearts={hearts} />
    </header>
  );
}

function RoastingBackButton() {
  return (
    <Link
      href="/lobby"
      aria-label="로비로 돌아가기"
      className="roasting-back-button flex h-10 w-10 items-center justify-center rounded-full border border-[#7a593b]/22 bg-[#fff5db]/88 text-2xl font-black text-[#5a3a25] backdrop-blur-sm active:scale-95"
      style={{ boxShadow: "0 8px 18px rgba(70, 46, 25, 0.18)" }}
    >
      ←
    </Link>
  );
}

function RoastingCurrencyHud({
  coins,
  beans,
  hearts,
}: {
  coins: number;
  beans: number;
  hearts: number;
}) {
  return (
    <div
      className="roasting-currency-hud mr-14 flex h-10 items-center gap-1.5 rounded-full border border-[#7a593b]/16 bg-white/62 px-2.5 py-1.5 backdrop-blur-md"
      style={{ boxShadow: "0 10px 22px rgba(80, 54, 30, 0.16)" }}
    >
      <CurrencyItem iconSrc="/images/optimized/ui/coin.webp" value={coins} label="코인" />
      <CurrencyItem iconSrc="/images/optimized/ui/bean.webp" value={beans} label="원두" />
      <CurrencyItem iconSrc="/images/optimized/ui/heart.webp" value={hearts} label="하트" />
    </div>
  );
}

function CurrencyItem({
  iconSrc,
  value,
  label,
}: {
  iconSrc: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`${label} ${value}`}>
      <Image
        src={iconSrc}
        alt=""
        width={18}
        height={18}
        className="h-4 w-4 object-contain"
      />
      <span className="text-[11px] font-black tabular-nums text-[#5d3c27]">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

function SelectedBeanInfoPanel({ bean }: { bean: BeanItem }) {
  return (
    <aside
      className="selected-bean-info-panel absolute right-3 top-[27.2dvh] w-[112px] overflow-hidden"
      data-asset-path={ROASTING_ASSETS.selectedBeanInfoPanel}
      style={{ aspectRatio: "233 / 402" }}
    >
      <Image
        src={ROASTING_ASSETS.selectedBeanInfoPanel}
        alt=""
        fill
        sizes="112px"
        className="object-contain"
      />
      <div className="absolute inset-0 px-2.5 pb-3 pt-8 text-center">
        <p className="text-[10px] font-black text-white drop-shadow-sm">
          선택 원두
        </p>
        <div className="mx-auto mt-3 flex h-[58px] w-[58px] items-center justify-center">
          <BeanVisual bean={bean} size={58} />
        </div>
        <h2 className="mt-2 line-clamp-2 text-[12px] font-black leading-tight text-[#543522]">
          {bean.name}
        </h2>
        <div className="mx-auto mt-2 flex max-w-[82px] flex-wrap justify-center gap-1">
          {bean.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#d9eef3]/92 px-1.5 py-0.5 text-[8px] font-black text-[#315a6c]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

function BeanSelectionRoastPanel({
  beans,
  selectedBeanId,
  stock,
  selectedRoastLevel,
  isRoasting,
  onSelectBean,
  onSelectLevel,
}: {
  beans: BeanItem[];
  selectedBeanId: string;
  stock: number;
  selectedRoastLevel: RoastLevel;
  isRoasting: boolean;
  onSelectBean: (id: string) => void;
  onSelectLevel: (level: RoastLevel) => void;
}) {
  return (
    <section
      className="bean-selection-roast-panel absolute inset-x-3 top-[50.5dvh]"
      data-asset-path={ROASTING_ASSETS.selectionPanel}
      style={{ aspectRatio: "702 / 400" }}
    >
      <Image
        src={ROASTING_ASSETS.selectionPanel}
        alt=""
        fill
        sizes="calc(100vw - 24px)"
        className="object-contain"
      />
      <span
        aria-hidden="true"
        className="absolute left-[29%] top-[14.5%] z-10 h-7 w-7 rounded-full bg-[#fff7e8] ring-1 ring-[#ead5b7]/70"
      />
      <div className="absolute left-[32%] top-[1.5%] rounded-full bg-[#6faed0] px-4 py-1 text-[13px] font-black text-white">
        원두 선택
      </div>
      <p className="absolute right-[8%] top-[69%] text-[10px] font-black text-[#76563b]/70">
        보유 원두 {stock}
      </p>

      {beans.map((bean, index) => (
        <BeanSelectButton
          key={bean.id}
          bean={bean}
          index={index}
          selected={bean.id === selectedBeanId}
          disabled={stock <= 0 || isRoasting}
          onSelect={onSelectBean}
        />
      ))}

      <div className="absolute left-[32%] top-[58.5%] rounded-full bg-[#6faed0] px-4 py-1 text-[12px] font-black text-white">
        로스팅 단계
      </div>
      <div className="absolute inset-x-[7%] bottom-[8%] grid h-[17%] grid-cols-3 gap-2">
        {ROAST_LEVELS.map((level) => {
          const active = selectedRoastLevel === level.id;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onSelectLevel(level.id)}
              disabled={isRoasting}
              className={cn(
                "roast-level-button flex min-w-0 flex-col items-center justify-center rounded-full border text-center transition-transform active:scale-[0.98] disabled:opacity-60",
                active
                  ? "border-[#4a9dc3] bg-[#bfe5f2] text-[#28536a]"
                  : "border-[#dfbd82]/70 bg-white/58 text-[#6a4a30]",
              )}
            >
              <span
                className="mb-0.5 h-3 w-5 rounded-b-full rounded-t-[80%]"
                style={{ backgroundColor: level.beanTone }}
              />
              <span className="text-[11px] font-black leading-none">
                {level.label}
              </span>
              <span className="mt-0.5 text-[8px] font-bold opacity-70">
                {level.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function BeanSelectButton({
  bean,
  index,
  selected,
  disabled,
  onSelect,
}: {
  bean: BeanItem;
  index: number;
  selected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}) {
  const leftByIndex = ["7%", "37%", "67%"];
  return (
    <button
      type="button"
      onClick={() => onSelect(bean.id)}
      disabled={disabled}
      className="bean-card absolute top-[16%] h-[47%] w-[26%] rounded-[18px] text-center transition-transform active:scale-[0.98] disabled:opacity-55"
      style={{ left: leftByIndex[index] }}
    >
      {selected ? (
        <span className="absolute right-0 top-0 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#69a9cf] text-sm font-black text-white ring-2 ring-white">
          ✓
        </span>
      ) : null}
      <div className="mx-auto mt-3 flex h-[46px] w-[46px] items-center justify-center">
        <BeanVisual bean={bean} size={46} />
      </div>
      <p className="mx-auto mt-1 line-clamp-1 max-w-[86px] text-[11px] font-black leading-tight text-[#563823]">
        {bean.shortName}
      </p>
      <RatingStars rating={bean.rarity} />
    </button>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="mt-1 flex justify-center gap-0.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <Image
          key={index}
          src={index < rating ? ROASTING_ASSETS.starsOn : ROASTING_ASSETS.starsOff}
          alt=""
          width={12}
          height={12}
          className="h-3 w-3 object-contain"
          loading="lazy"
        />
      ))}
    </div>
  );
}

function RoastingStartButton({
  status,
  canStart,
  onClick,
}: {
  status: RoastingStatus;
  canStart: boolean;
  onClick: () => void;
}) {
  const label =
    status === "roasting"
      ? "로스팅 중"
      : status === "complete"
        ? "완료 받기"
        : "로스팅 시작";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "idle" && !canStart}
      className="roasting-start-button absolute left-1/2 top-[75.3dvh] w-[240px] -translate-x-1/2 active:scale-[0.98] disabled:opacity-60"
      data-asset-path={ROASTING_ASSETS.startButton}
    >
      <span className="relative block" style={{ aspectRatio: "412 / 99" }}>
        <Image
          src={ROASTING_ASSETS.startButton}
          alt=""
          fill
          sizes="240px"
          className="object-contain"
        />
        <span className="absolute inset-0 flex items-center justify-center pl-7 text-[18px] font-black text-white drop-shadow-sm">
          {label}
        </span>
      </span>
    </button>
  );
}

function RoastingProgressPanel({
  status,
  remainingSeconds,
  progressPercent,
  roastCost,
  shotYield,
  maxShots,
  currentShots,
}: {
  status: RoastingStatus;
  remainingSeconds: number;
  progressPercent: number;
  roastCost: number;
  shotYield: number;
  maxShots: number;
  currentShots: number;
}) {
  const stateLabel =
    status === "complete"
      ? "로스팅 완료"
      : status === "roasting"
        ? "로스팅 중"
        : "대기 중";
  return (
    <section
      className="roasting-progress-panel absolute inset-x-3 top-[83dvh]"
      data-asset-path={ROASTING_ASSETS.progressPanel}
      style={{ aspectRatio: "703 / 158" }}
    >
      <Image
        src={ROASTING_ASSETS.progressPanel}
        alt=""
        fill
        sizes="calc(100vw - 24px)"
        className="object-contain"
      />
      <div className="absolute inset-y-0 left-[23%] right-[7%] flex flex-col justify-center">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold text-[#76563b]/72">진행 상태</p>
            <p className="text-[15px] font-black text-[#513522]">{stateLabel}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#76563b]/70">남은 시간</p>
            <p className="text-[15px] font-black tabular-nums text-[#3c8fbd]">
              {formatSeconds(remainingSeconds)}
            </p>
          </div>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border border-[#a5764f]/24 bg-[#dfc196]">
          <div
            className="h-full rounded-full bg-[#75b5d0]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[9px] font-black text-[#76563b]/76">
          <span>원두 {roastCost}개 사용</span>
          <span>
            샷 +{shotYield} · {currentShots}/{maxShots}
          </span>
        </div>
      </div>
    </section>
  );
}

function RoastingBottomActions() {
  return (
    <nav className="roasting-bottom-actions fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md gap-2.5 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <button
        type="button"
        disabled
        className="relative h-10 flex-1 overflow-hidden rounded-[18px] text-sm font-black text-[#7b5b3e]/70 disabled:opacity-80"
        data-asset-path={ROASTING_ASSETS.storageButton}
        title="보관함 route 연결 예정"
      >
        <Image
          src={ROASTING_ASSETS.storageButton}
          alt=""
          fill
          sizes="180px"
          className="object-contain"
        />
        <span className="relative z-10 flex h-full items-center justify-center pl-6">
          보관함
        </span>
      </button>
      <button
        type="button"
        disabled
        className="relative h-10 flex-1 overflow-hidden rounded-[18px] text-sm font-black text-[#7b5b3e]/70 disabled:opacity-80"
        data-asset-path={ROASTING_ASSETS.completedBeansButton}
        title="완료 원두 목록 연결 예정"
      >
        <Image
          src={ROASTING_ASSETS.completedBeansButton}
          alt=""
          fill
          sizes="180px"
          className="object-contain"
        />
        <span className="relative z-10 flex h-full items-center justify-center pl-6">
          완료 원두
        </span>
      </button>
    </nav>
  );
}

function BeanVisual({ bean, size }: { bean: BeanItem; size: number }) {
  return (
    <Image
      src={bean.imageSrc}
      alt=""
      width={size}
      height={size}
      className="h-full w-full object-contain"
      loading="lazy"
    />
  );
}

function formatSeconds(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
