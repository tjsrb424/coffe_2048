"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import {
  CAFE_ECONOMY,
  totalMenuStock,
  visibleMenuOrder,
} from "@/features/meta/balance/cafeEconomy";
import type { DrinkMenuId } from "@/features/meta/types/gameState";
import { useResetDocumentScrollOnMount } from "@/hooks/useResetDocumentScrollOnMount";
import { t } from "@/locale/i18n";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { useCustomerStore } from "@/stores/useCustomerStore";

type SaleDrinkItem = {
  id: DrinkMenuId;
  name: string;
  imageSrc?: string;
  stock: number;
  isSelected: boolean;
  isAvailable: boolean;
  sellPrice: number;
};

type TodayCustomerSlot = {
  id: string;
  startTime: string;
  endTime: string;
  recommendedDrinkId: DrinkMenuId;
  recommendedDrinkName: string;
  customerName: string;
  bonusType: "coin" | "affection" | "visit";
};

const COUNTER_ASSETS = {
  reference: "/assets/counter/reference/counter_final_reference.png",
  background: "/assets/counter/ui/background.png",
  backButton: "/assets/counter/ui/back_button.png",
  currencyHud: "/assets/counter/ui/currency_hud.png",
  titleSign: "/assets/counter/ui/title_sign.png",
  visualStage: "/assets/counter/ui/counter_visual_stage.png",
  menuBoard: "/assets/counter/ui/menu_board.png",
  posMachine: "/assets/counter/props/pos_machine.png",
  todayCustomersPanel: "/assets/counter/ui/today_customers_panel.png",
  recommendationBoard: "/assets/counter/ui/today_recommendation_board.png",
  saleDrinkPanel: "/assets/counter/ui/sale_drink_panel.png",
  drinkCard: "/assets/counter/ui/drink_card.png",
  drinkCardSelected: "/assets/counter/ui/drink_card_selected.png",
  checkIcon: "/assets/counter/ui/check_icon.png",
  pickerButton: "/assets/counter/ui/sale_drink_picker_button.png",
  startSaleButton: "/assets/counter/ui/start_sale_button.png",
  sellingStatusPanel: "/assets/counter/ui/selling_status_panel.png",
  progressBarBg: "/assets/counter/ui/progress_bar_bg.png",
  progressBarFill: "/assets/counter/ui/progress_bar_fill.png",
  storageButton: "/assets/counter/ui/storage_button.png",
  completedSalesButton: "/assets/counter/ui/completed_sales_button.png",
} as const;

const DRINK_IMAGES: Partial<Record<DrinkMenuId, string>> = {
  americano: "/images/optimized/drink/아메리카노.webp",
  latte: "/images/optimized/drink/카페라떼.webp",
  affogato: "/images/optimized/drink/아포가토.webp",
};

const DRINK_NAMES: Record<DrinkMenuId, string> = {
  americano: "아메리카노",
  latte: "카페 라떼",
  affogato: "아포가토",
  morning_mist_latte: "아침 안개 라떼",
  dawn_honey_shot: "새벽 허니 샷",
  noon_citrus_coffee: "정오 시트러스 커피",
  traveler_blend: "트래블러 블렌드",
  evening_caramel_crema: "이브닝 캐러멜 크레마",
  sunset_tea_latte: "선셋 티 라떼",
  night_velvet_mocha: "나이트 벨벳 모카",
  midnight_tonic: "미드나잇 토닉",
};

export function CounterScreen() {
  useResetDocumentScrollOnMount();

  const resources = useAppStore((s) => s.playerResources);
  const cafe = useAppStore((s) => s.cafeState);
  const codex = useAppStore((s) => s.beverageCodex);
  const startDisplaySelling = useAppStore((s) => s.startDisplaySelling);
  const displaySellingActive = cafe.displaySellingActive;
  const menuStock = cafe.menuStock;
  const totalStock = totalMenuStock(menuStock);
  const runtime = getCafeRuntimeModifiers(cafe);

  const featuredCustomerId = useCustomerStore((s) => s.featuredCustomerId);
  const featuredProfile = useCustomerStore((s) => s.profile(featuredCustomerId));
  const ensureFeaturedForToday = useCustomerStore((s) => s.ensureFeaturedForToday);
  const ensureSaleSession = useCustomerStore((s) => s.ensureSaleSession);
  const lastCounterSalePing = useCustomerStore((s) => s.lastCounterSalePing);
  const saleSession = useCustomerStore((s) => s.saleSession);

  const visibleDrinkIds = useMemo(() => visibleMenuOrder(codex), [codex]);
  const defaultSelectedIds = useMemo(
    () => visibleDrinkIds.filter((id) => menuStock[id] > 0).slice(0, 3),
    [menuStock, visibleDrinkIds],
  );
  const [selectedDrinkIds, setSelectedDrinkIds] = useState<DrinkMenuId[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    ensureFeaturedForToday();
  }, [ensureFeaturedForToday]);

  useEffect(() => {
    if (selectedDrinkIds.length > 0) return;
    setSelectedDrinkIds(defaultSelectedIds);
  }, [defaultSelectedIds, selectedDrinkIds.length]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  const saleDrinks = useMemo<SaleDrinkItem[]>(
    () =>
      visibleDrinkIds.slice(0, 6).map((id) => ({
        id,
        name: DRINK_NAMES[id],
        imageSrc: DRINK_IMAGES[id],
        stock: menuStock[id],
        isSelected: selectedDrinkIds.includes(id),
        isAvailable: menuStock[id] > 0,
        sellPrice: CAFE_ECONOMY.sellPrice[id] + runtime.sellBonus,
      })),
    [menuStock, runtime.sellBonus, selectedDrinkIds, visibleDrinkIds],
  );

  const selectedSaleDrinks = useMemo(
    () =>
      selectedDrinkIds
        .map((id) => saleDrinks.find((drink) => drink.id === id))
        .filter((drink): drink is SaleDrinkItem => Boolean(drink)),
    [saleDrinks, selectedDrinkIds],
  );

  const featuredName = featuredProfile
    ? t(featuredProfile.nameTextId)
    : "오늘의 손님";
  const preferredMenu = featuredProfile?.preferredMenus[0] ?? "americano";
  const todaySlots = useMemo<TodayCustomerSlot[]>(
    () => [
      {
        id: "morning",
        startTime: "09:30",
        endTime: "12:00",
        recommendedDrinkId: preferredMenu,
        recommendedDrinkName: DRINK_NAMES[preferredMenu],
        customerName: featuredName,
        bonusType: "affection",
      },
      {
        id: "afternoon",
        startTime: "15:00",
        endTime: "18:00",
        recommendedDrinkId: "latte",
        recommendedDrinkName: DRINK_NAMES.latte,
        customerName: featuredName,
        bonusType: "coin",
      },
    ],
    [featuredName, preferredMenu],
  );

  const recommendation = todaySlots[1] ?? todaySlots[0]!;
  const preparedCups = selectedSaleDrinks.reduce(
    (sum, drink) => sum + drink.stock,
    0,
  );
  const activeInterval = runtime.autoSellIntervalMs;
  const cycleElapsed = displaySellingActive
    ? Math.max(0, now - (cafe.lastAutoSellAtMs || now))
    : 0;
  const progressPercent = displaySellingActive
    ? Math.min(100, Math.round((cycleElapsed / activeInterval) * 100))
    : lastCounterSalePing && now - lastCounterSalePing.atMs < 8000
      ? 100
      : 0;
  const remainingSeconds = displaySellingActive
    ? Math.max(0, Math.ceil((activeInterval - cycleElapsed) / 1000))
    : 0;
  const canStartSale =
    selectedSaleDrinks.length > 0 &&
    preparedCups > 0 &&
    totalStock > 0 &&
    !displaySellingActive;
  const completedSaleReady =
    Boolean(lastCounterSalePing) &&
    now - (lastCounterSalePing?.atMs ?? 0) < 15_000;

  const toggleDrink = (id: DrinkMenuId) => {
    if (displaySellingActive) return;
    const stock = menuStock[id] ?? 0;
    if (stock <= 0) return;
    setSelectedDrinkIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= 3) {
        return [...current.slice(1), id];
      }
      return [...current, id];
    });
  };

  const selectAvailableTopThree = () => {
    if (displaySellingActive) return;
    setSelectedDrinkIds(defaultSelectedIds);
  };

  const handleStartSale = () => {
    if (!canStartSale) return;
    const started = startDisplaySelling();
    if (started) {
      ensureSaleSession();
    }
  };

  return (
    <CounterBackground>
      <CounterHeader
        coins={resources.coins}
        beans={resources.beans}
        hearts={resources.hearts}
      />

      <main className="relative z-10 mx-auto flex h-[100dvh] w-full max-w-md flex-col px-3 pb-[70px] pt-[68px]">
        <CounterTitleSign />
        <CounterVisualStage
          slots={todaySlots}
          recommendation={recommendation}
          customerName={featuredName}
        />

        <SaleDrinkSelectionPanel
          drinks={saleDrinks.slice(0, 3)}
          selectedCount={selectedSaleDrinks.length}
          isSelling={displaySellingActive}
          onToggleDrink={toggleDrink}
          onOpenPicker={selectAvailableTopThree}
        />

        <StartSaleButton
          isSelling={displaySellingActive}
          canStart={canStartSale}
          completedReady={completedSaleReady}
          onClick={handleStartSale}
        />

        <SellingStatusPanel
          isSelling={displaySellingActive}
          drinks={selectedSaleDrinks}
          preparedCups={preparedCups}
          remainingSeconds={remainingSeconds}
          progressPercent={progressPercent}
          sessionGuestCount={saleSession?.queue.length ?? 0}
          completedSaleReady={completedSaleReady}
        />
      </main>

      <CounterBottomActions completedReady={completedSaleReady} />
    </CounterBackground>
  );
}

function CounterBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="counter-background relative min-h-[100dvh] overflow-hidden bg-[#f7dfb8]"
      data-asset-path={COUNTER_ASSETS.background}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #cfeef4 0%, #eaf6ec 28%, #f6deae 58%, #dcae74 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-[130px] h-[150px] bg-[#f8e2b8]/78" />
      <div
        className="absolute inset-x-0 bottom-0 h-[210px]"
        style={{
          background: "linear-gradient(180deg, #c48c52 0%, #a96d3f 100%)",
        }}
      />
      <div className="absolute left-1/2 top-[242px] h-[42px] w-[92%] -translate-x-1/2 rounded-t-[32px] bg-[#b77a47]" />
      {children}
    </div>
  );
}

function CounterHeader({
  coins,
  beans,
  hearts,
}: {
  coins: number;
  beans: number;
  hearts: number;
}) {
  return (
    <header className="counter-header fixed inset-x-0 top-0 z-40 mx-auto flex max-w-md items-start justify-between px-3 pt-[calc(env(safe-area-inset-top)+8px)]">
      <CounterBackButton />
      <CounterCurrencyHud coins={coins} beans={beans} hearts={hearts} />
    </header>
  );
}

function CounterBackButton() {
  return (
    <Link
      href="/lobby"
      aria-label="로비로 돌아가기"
      className="counter-back-button flex h-10 w-10 items-center justify-center rounded-full border border-[#b98554]/45 bg-[#fff5dc]/92 text-lg font-black text-[#6d462b]"
      style={{ boxShadow: "0 6px 14px rgba(83, 52, 28, 0.16)" }}
      data-asset-path={COUNTER_ASSETS.backButton}
    >
      ←
    </Link>
  );
}

function CounterCurrencyHud({
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
      className="counter-currency-hud flex h-9 items-center gap-1.5 rounded-full border border-white/50 bg-white/58 px-2.5 text-[11px] font-black text-[#6b4b32] backdrop-blur-md"
      data-asset-path={COUNTER_ASSETS.currencyHud}
    >
      <CounterCurrencyItem
        icon="/images/optimized/ui/coin.webp"
        label="코인"
        value={coins}
      />
      <CounterCurrencyItem
        icon="/images/optimized/ui/bean.webp"
        label="원두"
        value={beans}
      />
      <CounterCurrencyItem
        icon="/images/optimized/ui/heart.webp"
        label="하트"
        value={hearts}
      />
    </div>
  );
}

function CounterCurrencyItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <span className="flex items-center gap-0.5 tabular-nums">
      <Image
        src={icon}
        alt={label}
        width={18}
        height={18}
        className="h-4 w-4 object-contain"
        loading="lazy"
      />
      {value}
    </span>
  );
}

function CounterTitleSign() {
  return (
    <section
      className="counter-title-sign mx-auto flex h-[58px] w-[188px] flex-col items-center justify-center rounded-b-[26px] rounded-t-[12px] border border-[#9b6b42]/45 bg-[#8f5d38] text-center text-white"
      style={{
        boxShadow:
          "inset 0 2px 0 rgba(255,255,255,0.22), 0 8px 16px rgba(70, 42, 21, 0.18)",
      }}
      data-asset-path={COUNTER_ASSETS.titleSign}
    >
      <p className="text-xl font-black leading-none">계산대</p>
      <p className="mt-1 text-[10px] font-bold text-[#ffedc9]">
        오늘 판매를 준비해요
      </p>
    </section>
  );
}

function CounterVisualStage({
  slots,
  recommendation,
  customerName,
}: {
  slots: TodayCustomerSlot[];
  recommendation: TodayCustomerSlot;
  customerName: string;
}) {
  return (
    <section
      className="counter-visual-stage relative mt-1 grid h-[202px] grid-cols-[1fr_172px] gap-2"
      data-asset-path={COUNTER_ASSETS.visualStage}
    >
      <div className="relative min-w-0">
        <div
          className="counter-menu-board absolute left-2 top-2 h-[74px] w-[112px] rounded-[14px] border-4 border-[#7a4b2f] bg-[#405645] p-2 text-[#f7edc7]"
          data-asset-path={COUNTER_ASSETS.menuBoard}
        >
          <p className="text-[10px] font-black">MENU</p>
          <p className="mt-1 text-[9px] font-bold leading-tight">
            Americano · Latte
          </p>
        </div>

        <TodayRecommendationBoard slot={recommendation} />

        <div
          className="counter-pos-machine absolute bottom-0 left-[88px] h-[96px] w-[138px]"
          data-asset-path={COUNTER_ASSETS.posMachine}
        >
          <div className="absolute left-8 top-0 h-11 w-[78px] rounded-[12px] border border-[#5b6c72]/30 bg-[#d4e7ea]" />
          <div className="absolute bottom-0 left-0 h-[58px] w-full rounded-t-[22px] bg-[#f0d7a9]" />
          <div className="absolute bottom-3 left-5 grid w-[96px] grid-cols-4 gap-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                className="h-1.5 rounded-full bg-[#9f7650]/45"
              />
            ))}
          </div>
        </div>
      </div>

      <TodayCustomersPanel
        slots={slots}
        customerName={customerName}
      />
    </section>
  );
}

function TodayCustomersPanel({
  slots,
  customerName,
}: {
  slots: TodayCustomerSlot[];
  customerName: string;
}) {
  return (
    <aside
      className="today-customers-panel h-full rounded-[20px] border border-[#b78b5f]/35 bg-[#fff7e4]/94 p-3"
      style={{ boxShadow: "0 8px 18px rgba(83, 52, 28, 0.12)" }}
      data-asset-path={COUNTER_ASSETS.todayCustomersPanel}
    >
      <div className="mb-2">
        <p className="text-sm font-black text-[#513521]">오늘의 손님</p>
        <p className="line-clamp-1 text-[11px] font-bold text-[#7c5c3d]">
          {customerName} 방문 예정
        </p>
      </div>
      <div className="space-y-1.5">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="rounded-[14px] border border-[#dfbf85]/55 bg-[#fffdf5] px-2 py-1.5"
          >
            <p className="text-[10px] font-black text-[#4f9ec2]">
              {slot.startTime} ~ {slot.endTime}
            </p>
            <p className="line-clamp-1 text-[11px] font-black text-[#5d3e27]">
              {slot.recommendedDrinkName}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] font-bold leading-tight text-[#7c5c3d]/78">
        추천 시간에 판매하면 손님 반응이 더 좋아져요.
      </p>
    </aside>
  );
}

function TodayRecommendationBoard({ slot }: { slot: TodayCustomerSlot }) {
  return (
    <aside
      className="today-recommendation-board absolute bottom-2 left-0 w-[84px] rounded-[12px] border border-[#b78b5f]/35 bg-[#fff2d8]/90 p-2 text-center"
      data-asset-path={COUNTER_ASSETS.recommendationBoard}
    >
      <p className="text-[10px] font-black text-[#6d4b31]">오늘의 추천</p>
      <p className="mt-1 line-clamp-2 text-[10px] font-black leading-tight text-[#503521]">
        {slot.recommendedDrinkName}
      </p>
      <DrinkImage id={slot.recommendedDrinkId} name={slot.recommendedDrinkName} small />
    </aside>
  );
}

function SaleDrinkSelectionPanel({
  drinks,
  selectedCount,
  isSelling,
  onToggleDrink,
  onOpenPicker,
}: {
  drinks: SaleDrinkItem[];
  selectedCount: number;
  isSelling: boolean;
  onToggleDrink: (id: DrinkMenuId) => void;
  onOpenPicker: () => void;
}) {
  return (
    <section
      className="sale-drink-selection-panel mt-1.5 rounded-[22px] border border-[#bd8b5d]/32 bg-[#fff6df]/92 p-2.5"
      style={{ boxShadow: "0 8px 18px rgba(80, 51, 27, 0.1)" }}
      data-asset-path={COUNTER_ASSETS.saleDrinkPanel}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-black text-[#533621]">개시 음료</h2>
          <p className="text-[11px] font-bold text-[#76563b]/70">
            판매할 음료를 최대 3개 골라요.
          </p>
        </div>
        <SaleDrinkPickerButton
          disabled={isSelling}
          selectedCount={selectedCount}
          onClick={onOpenPicker}
        />
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {drinks.map((drink) => (
          <SaleDrinkCard
            key={drink.id}
            drink={drink}
            disabled={isSelling || !drink.isAvailable}
            onToggle={onToggleDrink}
          />
        ))}
      </div>
    </section>
  );
}

function SaleDrinkPickerButton({
  disabled,
  selectedCount,
  onClick,
}: {
  disabled: boolean;
  selectedCount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="sale-drink-picker-button h-9 shrink-0 rounded-full border border-[#c49d6e]/45 bg-[#fffaf0] px-3 text-[11px] font-black text-[#6a4a30] disabled:opacity-55"
      data-asset-path={COUNTER_ASSETS.pickerButton}
    >
      판매 음료 선택 {selectedCount}
    </button>
  );
}

function SaleDrinkCard({
  drink,
  disabled,
  onToggle,
}: {
  drink: SaleDrinkItem;
  disabled: boolean;
  onToggle: (id: DrinkMenuId) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(drink.id)}
      className={cn(
        "sale-drink-card relative min-h-[100px] rounded-[18px] border p-1.5 text-center transition-transform active:scale-[0.98] disabled:opacity-55",
        drink.isSelected
          ? "border-[#4c9ec3] bg-[#f4fbff] ring-2 ring-[#80c2dd]"
          : "border-[#d0a978]/48 bg-[#fffaf0]",
      )}
      data-asset-path={
        drink.isSelected
          ? COUNTER_ASSETS.drinkCardSelected
          : COUNTER_ASSETS.drinkCard
      }
    >
      {drink.isSelected ? (
        <span
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#4c9ec3] text-xs font-black text-white"
          data-asset-path={COUNTER_ASSETS.checkIcon}
        >
          ✓
        </span>
      ) : null}
      <div className="mx-auto mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0d6ad]">
        <DrinkImage id={drink.id} name={drink.name} small />
      </div>
      <p className="mt-1 line-clamp-2 text-[11px] font-black leading-tight text-[#563823]">
        {drink.name}
      </p>
      <p className="mt-0.5 text-[10px] font-black text-[#7a5b3d]/72">
        {drink.stock}잔 · {drink.sellPrice}C
      </p>
    </button>
  );
}

function StartSaleButton({
  isSelling,
  canStart,
  completedReady,
  onClick,
}: {
  isSelling: boolean;
  canStart: boolean;
  completedReady: boolean;
  onClick: () => void;
}) {
  const label = isSelling
    ? "판매 중"
    : completedReady
      ? "판매 완료 확인"
      : "판매 개시";
  return (
    <button
      type="button"
      disabled={!canStart}
      onClick={onClick}
      className="start-sale-button mt-1.5 flex h-11 w-full items-center justify-center rounded-full border border-[#4f9ec2]/45 bg-[#75b9d6] text-lg font-black text-white disabled:border-[#c4a77e]/40 disabled:bg-[#dac5a0] disabled:text-[#82684b]"
      style={{
        boxShadow:
          "inset 0 2px 0 rgba(255, 255, 255, 0.45), 0 10px 22px rgba(70, 91, 98, 0.16)",
      }}
      data-asset-path={COUNTER_ASSETS.startSaleButton}
    >
      {label}
    </button>
  );
}

function SellingStatusPanel({
  isSelling,
  drinks,
  preparedCups,
  remainingSeconds,
  progressPercent,
  sessionGuestCount,
  completedSaleReady,
}: {
  isSelling: boolean;
  drinks: SaleDrinkItem[];
  preparedCups: number;
  remainingSeconds: number;
  progressPercent: number;
  sessionGuestCount: number;
  completedSaleReady: boolean;
}) {
  const label = isSelling
    ? "판매 중"
    : completedSaleReady
      ? "판매 기록 도착"
      : "판매 대기";
  return (
    <section
      className="selling-status-panel mt-1.5 rounded-[22px] border border-[#a9c7d6]/55 bg-[#f6fbff]/92 p-2.5"
      style={{ boxShadow: "0 8px 18px rgba(56, 82, 94, 0.12)" }}
      data-asset-path={COUNTER_ASSETS.sellingStatusPanel}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-full bg-[#75b9d6] px-3 py-1 text-sm font-black text-white">
          {label}
        </span>
        <span className="text-[11px] font-black text-[#456575]/72">
          대기 손님 {sessionGuestCount}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_104px] gap-2">
        <div>
          <p className="text-[12px] font-black text-[#4d3a2a]">
            선택한 음료 {drinks.length}종 판매 중
          </p>
          <div className="mt-1.5 flex gap-1.5">
            {(drinks.length > 0 ? drinks : []).slice(0, 3).map((drink) => (
              <div
                key={drink.id}
                className="h-[58px] w-[48px] rounded-[12px] border border-[#c8a77d]/35 bg-white/78 p-1 text-center"
              >
                <DrinkImage id={drink.id} name={drink.name} small />
                <p className="mt-0.5 line-clamp-1 text-[8px] font-black text-[#5f432d]">
                  {drink.name}
                </p>
              </div>
            ))}
            {drinks.length === 0 ? (
              <p className="text-[11px] font-bold text-[#76563b]/70">
                판매할 음료를 골라주세요.
              </p>
            ) : null}
          </div>
        </div>
        <div className="rounded-[18px] bg-[#dcecf5] p-2 text-center">
          <p className="text-[10px] font-black text-[#456575]/75">준비된 수량</p>
          <p className="mt-1 text-2xl font-black tabular-nums text-[#3b8fbd]">
            {preparedCups}
          </p>
          <p className="text-[10px] font-black text-[#456575]/75">잔</p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-[11px] font-black text-[#456575]/82">
          남은 시간{" "}
          <span className="text-base tabular-nums text-[#3b8fbd]">
            {formatSeconds(remainingSeconds)}
          </span>
        </div>
        <span className="text-[11px] font-black tabular-nums text-[#456575]/70">
          {progressPercent}%
        </span>
      </div>
      <SaleProgressBar progressPercent={progressPercent} />
    </section>
  );
}

function SaleProgressBar({ progressPercent }: { progressPercent: number }) {
  return (
    <div
      className="sale-progress-bar-bg mt-1.5 h-3 overflow-hidden rounded-full border border-[#a5764f]/24 bg-[#dfc196]"
      data-asset-path={COUNTER_ASSETS.progressBarBg}
    >
      <div
        className="sale-progress-bar-fill h-full rounded-full bg-[#3d9ed0]"
        style={{ width: `${progressPercent}%` }}
        data-asset-path={COUNTER_ASSETS.progressBarFill}
      />
    </div>
  );
}

function CounterBottomActions({ completedReady }: { completedReady: boolean }) {
  return (
    <nav className="counter-bottom-actions fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-md gap-2.5 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <Link
        href="/lobby/workbench"
        className="h-10 flex-1 rounded-full border border-[#c4a77e]/45 bg-[#fff3d5]/92 text-center text-sm font-black leading-10 text-[#7b5b3e]"
        data-asset-path={COUNTER_ASSETS.storageButton}
      >
        보관함
      </Link>
      <button
        type="button"
        disabled={!completedReady}
        className={cn(
          "h-10 flex-1 rounded-full border text-sm font-black",
          completedReady
            ? "border-[#4f9ec2]/45 bg-[#bfe2ef] text-[#28536a]"
            : "border-[#c4a77e]/45 bg-[#fff3d5]/88 text-[#7b5b3e]/70",
        )}
        data-asset-path={COUNTER_ASSETS.completedSalesButton}
        title="판매 결과 화면 연결 예정"
      >
        완료 판매
      </button>
    </nav>
  );
}

function DrinkImage({
  id,
  name,
  small,
}: {
  id: DrinkMenuId;
  name: string;
  small?: boolean;
}) {
  const imageSrc = DRINK_IMAGES[id];
  const size = small ? 38 : 52;
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={name}
        width={size}
        height={size}
        className="mx-auto h-full max-h-[38px] w-full max-w-[38px] object-contain"
        loading="lazy"
        sizes={`${size}px`}
      />
    );
  }
  return (
    <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#f1d3a5] text-sm font-black text-[#744b30]">
      ☕
    </span>
  );
}

function formatSeconds(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
