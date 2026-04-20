import type { LobbySheetId } from "@/features/lobby/config/lobbyHotspots";
import type { AppPersistState } from "@/features/meta/types/gameState";
import { t } from "@/locale/i18n";

type SheetSnapshot = Pick<
  AppPersistState,
  "playerResources" | "puzzleProgress" | "cafeState"
>;

/** 시트 헤더 아래 한 줄 상태 요약(숫자 위주) */
export function buildLobbySheetSummary(
  sheet: LobbySheetId,
  state: SheetSnapshot,
): string {
  const { cafeState, puzzleProgress, playerResources } = state;
  const stock =
    cafeState.menuStock.americano +
    cafeState.menuStock.latte +
    cafeState.menuStock.affogato;

  switch (sheet) {
    case "roast":
      return t("lobby.summary.roast", {
        shots: cafeState.espressoShots,
        beans: playerResources.beans,
      });
    case "showcase":
      if (stock === 0) return t("lobby.summary.showcase.empty");
      if (!cafeState.displaySellingActive)
        return t("lobby.summary.showcase.idle", { stock });
      return t("lobby.summary.showcase.selling", { stock });
    case "counter": {
      const offline =
        cafeState.lastOfflineSaleAtMs > 0 && cafeState.lastOfflineSaleCoins > 0
          ? t("lobby.summary.counter.offline", {
              coins: cafeState.lastOfflineSaleCoins,
            })
          : null;
      const puzzle =
        puzzleProgress.totalRuns > 0
          ? t("lobby.summary.counter.puzzleRecent", {
              score: puzzleProgress.lastRunScore,
            })
          : t("lobby.summary.counter.puzzleNone");
      const stockLine =
        stock === 0
          ? t("lobby.summary.counter.stockEmpty")
          : cafeState.displaySellingActive
            ? t("lobby.summary.counter.stockSelling", { stock })
            : t("lobby.summary.counter.stockIdle", { stock });
      const tail = offline ? `${offline} · ${puzzle}` : puzzle;
      return `${stockLine} · ${tail}`;
    }
    case "puzzle":
      return t("lobby.summary.puzzle", {
        hearts: playerResources.hearts,
        bestTile: puzzleProgress.bestTile,
      });
    case "shop":
      return t("lobby.summary.shop", { coins: playerResources.coins });
    default:
      return "";
  }
}
