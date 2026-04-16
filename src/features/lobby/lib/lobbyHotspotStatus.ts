import { getCafeRuntimeModifiers } from "@/features/meta/balance/cafeModifiers";
import {
  CAFE_ECONOMY,
  MENU_ORDER,
  MENU_UNLOCK_CAFE_LEVEL,
} from "@/features/meta/balance/cafeEconomy";
import type { LobbyHotspotId } from "@/features/lobby/config/lobbyHotspots";
import type { AppPersistState } from "@/features/meta/types/gameState";

type Snapshot = Pick<AppPersistState, "cafeState" | "playerResources">;

function hasAnyCraftable(
  cafe: Snapshot["cafeState"],
  beans: number,
  shots: number,
): boolean {
  for (const id of MENU_ORDER) {
    if (cafe.cafeLevel < (MENU_UNLOCK_CAFE_LEVEL[id] ?? 1)) continue;
    const r = CAFE_ECONOMY.recipe[id];
    if (shots >= r.shots && beans >= r.beans) return true;
  }
  return false;
}

/**
 * 로비 핫존 하단 상태 태그(짧은 한 줄) — 저자극 가독성용
 */
export function buildLobbyHotspotStatusTags(
  state: Snapshot,
): Partial<Record<LobbyHotspotId, string>> {
  const { cafeState, playerResources } = state;
  const m = getCafeRuntimeModifiers(cafeState);
  const beans = playerResources.beans;
  const shots = cafeState.espressoShots;
  const stock = cafeState.menuStock;
  const total = stock.americano + stock.latte + stock.affogato;

  const roastTag =
    shots >= m.maxShots
      ? "베이스 가득"
      : beans < m.roastBeanCost
        ? "원두 부족"
        : "로스팅 하기";

  let showcaseTag: string;
  if (total > 0) {
    showcaseTag = "진열 중";
  } else if (hasAnyCraftable(cafeState, beans, shots)) {
    showcaseTag = "제작하기";
  } else if (shots < 1) {
    showcaseTag = "베이스 부족";
  } else {
    showcaseTag = "자원 부족";
  }

  const counterTag = total > 0 ? "판매 중" : "진열 채우기";

  return {
    roast: roastTag,
    showcase: showcaseTag,
    counter: counterTag,
    puzzle: "퍼즐",
  };
}
