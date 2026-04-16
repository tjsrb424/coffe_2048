"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SAMPLE_CUSTOMERS } from "@/data/customers";
import type { DrinkMenuId } from "@/features/meta/types/gameState";
import type {
  CustomerId,
  CustomerProfile,
  CustomerRuntimeState,
} from "@/features/customers/types";
import { nextRuntimeStateOnAffectionGain } from "@/features/customers/lib/affection";

type CustomerIndex = Record<CustomerId, CustomerProfile>;

type CustomerSaveState = {
  /** 고객별 런타임 상태(애정도/단골/스토리 단계). */
  byId: Record<CustomerId, CustomerRuntimeState>;
  /** MVP: 오늘의 대표 손님(판매 루프 최소 연결). */
  featuredCustomerId: CustomerId;
};

export type CustomerStore = CustomerSaveState & {
  /** 가게 애정도(정의: 개별 손님 애정도의 합산) */
  shopAffection: () => number;
  /** 고객 프로필 조회(샘플/추후 확장) */
  profile: (id: CustomerId) => CustomerProfile | null;
  /** 고객 상태 조회 */
  stateOf: (id: CustomerId) => CustomerRuntimeState | null;
  /** 판매 1회(또는 soldCount 묶음) 발생 시 애정도 상승 훅 */
  recordCafeSale: (input: {
    soldCount: number;
    /** 판매된 메뉴 ID(가능하면 전달, 현재 루프에서는 optional) */
    menuId?: DrinkMenuId;
    nowMs?: number;
  }) => void;
  /** 대표 손님 변경(추후 로테이션/조건 연결 대비) */
  setFeaturedCustomer: (id: CustomerId) => void;
};

const PROFILE_INDEX: CustomerIndex = Object.fromEntries(
  SAMPLE_CUSTOMERS.map((c) => [c.id, c]),
);

function defaultRuntimeState(profile: CustomerProfile): CustomerRuntimeState {
  return {
    affection: profile.baseAffection,
    isRegular: false,
    storyIndex: 0,
    lastAffectionAtMs: 0,
  };
}

function ensureStateFor(
  byId: Record<CustomerId, CustomerRuntimeState>,
  id: CustomerId,
): CustomerRuntimeState {
  return byId[id] ?? defaultRuntimeState(PROFILE_INDEX[id] ?? SAMPLE_CUSTOMERS[0]);
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      byId: Object.fromEntries(
        SAMPLE_CUSTOMERS.map((c) => [c.id, defaultRuntimeState(c)]),
      ),
      featuredCustomerId: SAMPLE_CUSTOMERS[0].id,

      shopAffection: () => {
        const byId = get().byId;
        return Object.values(byId).reduce((sum, s) => sum + (s.affection ?? 0), 0);
      },

      profile: (id) => PROFILE_INDEX[id] ?? null,

      stateOf: (id) => {
        const p = PROFILE_INDEX[id];
        if (!p) return null;
        const s = get().byId[id];
        return s ?? defaultRuntimeState(p);
      },

      recordCafeSale: ({ soldCount, menuId, nowMs }) => {
        if (soldCount <= 0) return;
        const id = get().featuredCustomerId;
        const profile = PROFILE_INDEX[id];
        if (!profile) return;
        const prev = ensureStateFor(get().byId, id);

        // MVP: 판매 1잔당 +1, 선호 메뉴면 추가 +1 (menuId가 전달된 경우만)
        const prefBonus = menuId && profile.preferredMenus.includes(menuId) ? 1 : 0;
        const gainedAffection = soldCount + prefBonus;
        const now = nowMs ?? Date.now();

        const next = nextRuntimeStateOnAffectionGain({
          profile,
          prev,
          gainedAffection,
          nowMs: now,
        });

        set((s) => ({
          byId: {
            ...s.byId,
            [id]: next,
          },
        }));
      },

      setFeaturedCustomer: (id) => {
        if (!PROFILE_INDEX[id]) return;
        set({ featuredCustomerId: id });
      },
    }),
    {
      name: "coffee2048_customers_v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        byId: s.byId,
        featuredCustomerId: s.featuredCustomerId,
      }),
    },
  ),
);

