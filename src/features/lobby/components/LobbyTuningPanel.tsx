"use client";

import type { ChangeEvent } from "react";
import {
  LOBBY_LAYOUT_KEYS,
  LOBBY_LAYOUT_LABELS,
  type LobbyLayout,
  type LobbyLayoutItem,
  type LobbyLayoutKey,
} from "@/features/lobby/config/lobbyLayout";
import { cn } from "@/lib/utils";

type LobbyTuningPanelProps = {
  layout: LobbyLayout;
  selectedKey: LobbyLayoutKey;
  overlayEnabled: boolean;
  overlayOpacity: number;
  onSelectedKeyChange: (key: LobbyLayoutKey) => void;
  onLayoutItemChange: (
    key: LobbyLayoutKey,
    patch: Partial<LobbyLayoutItem>,
  ) => void;
  onResetLayout: () => void;
  onOverlayEnabledChange: (enabled: boolean) => void;
  onOverlayOpacityChange: (opacity: number) => void;
};

const CONTROL_CLASS =
  "h-8 rounded-xl border border-coffee-600/15 bg-cream-50/92 px-2 text-xs font-semibold text-coffee-950 outline-none ring-1 ring-coffee-600/10 focus:border-accent-soft/50 focus:ring-accent-soft/35";

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function readNumber(event: ChangeEvent<HTMLInputElement>, fallback: number) {
  const value = event.currentTarget.valueAsNumber;
  return Number.isFinite(value) ? value : fallback;
}

export function LobbyTuningPanel({
  layout,
  selectedKey,
  overlayEnabled,
  overlayOpacity,
  onSelectedKeyChange,
  onLayoutItemChange,
  onResetLayout,
  onOverlayEnabledChange,
  onOverlayOpacityChange,
}: LobbyTuningPanelProps) {
  const selected = layout[selectedKey];

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[90] w-[calc(100vw-1.5rem)] max-w-[22rem] text-coffee-950">
      <div className="pointer-events-auto rounded-3xl bg-cream-50/94 p-3 shadow-[0_18px_48px_rgb(42_27_18_/_0.18)] ring-1 ring-coffee-600/12 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-coffee-950/60">
              Lobby tuning
            </div>
            <p className="mt-1 text-xs leading-relaxed text-coffee-950/82">
              기준 좌표: reference 원본 942x1672px
            </p>
          </div>
          <button
            type="button"
            onClick={onResetLayout}
            className="rounded-full bg-coffee-950/8 px-3 py-1.5 text-[11px] font-bold text-coffee-950 ring-1 ring-coffee-600/12"
          >
            Reset
          </button>
        </div>

        <label className="mt-3 block text-[11px] font-bold text-coffee-950/75">
          Element
          <select
            value={selectedKey}
            onChange={(event) =>
              onSelectedKeyChange(event.currentTarget.value as LobbyLayoutKey)
            }
            className={cn(CONTROL_CLASS, "mt-1 w-full")}
          >
            {LOBBY_LAYOUT_KEYS.map((key) => (
              <option key={key} value={key}>
                {LOBBY_LAYOUT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <NumberField
            label="x"
            value={selected.x}
            step={1}
            onChange={(x) => onLayoutItemChange(selectedKey, { x })}
          />
          <NumberField
            label="y"
            value={selected.y}
            step={1}
            onChange={(y) => onLayoutItemChange(selectedKey, { y })}
          />
          <NumberField
            label="width"
            value={selected.width}
            step={1}
            min={1}
            onChange={(width) => onLayoutItemChange(selectedKey, { width })}
          />
          <NumberField
            label="scale"
            value={selected.scale}
            step={0.01}
            min={0.05}
            onChange={(scale) => onLayoutItemChange(selectedKey, { scale })}
          />
          <NumberField
            label="zIndex"
            value={selected.zIndex}
            step={1}
            onChange={(zIndex) => onLayoutItemChange(selectedKey, { zIndex })}
          />
          <NumberField
            label="opacity"
            value={selected.opacity ?? 1}
            step={0.01}
            min={0}
            max={1}
            onChange={(opacity) =>
              onLayoutItemChange(selectedKey, {
                opacity: clampNumber(opacity, 0, 1),
              })
            }
          />
        </div>

        <div className="mt-3 rounded-2xl bg-coffee-950/5 p-2 ring-1 ring-coffee-600/10">
          <div className="flex items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-coffee-950/88">
              <input
                type="checkbox"
                checked={overlayEnabled}
                onChange={(event) =>
                  onOverlayEnabledChange(event.currentTarget.checked)
                }
                className="h-4 w-4 accent-[#f0c36f]"
              />
              Reference overlay
            </label>
            <span className="text-[11px] font-semibold tabular-nums text-coffee-950/70">
              {Math.round(overlayOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.05}
            max={1}
            step={0.01}
            value={overlayOpacity}
            onChange={(event) =>
              onOverlayOpacityChange(
                clampNumber(readNumber(event, overlayOpacity), 0.05, 1),
              )
            }
            className="mt-2 w-full accent-[#f0c36f]"
          />
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-coffee-950/68">
          화살표는 1px, Shift+화살표는 10px 이동입니다. 입력칸에 포커스가 있을
          때는 키보드 이동을 멈춥니다.
        </p>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  step,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-[11px] font-bold text-coffee-950/75">
      {label}
      <input
        type="number"
        value={Number(value.toFixed(step < 1 ? 2 : 0))}
        step={step}
        min={min}
        max={max}
        onChange={(event) => onChange(readNumber(event, value))}
        className={cn(CONTROL_CLASS, "mt-1 w-full tabular-nums")}
      />
    </label>
  );
}
