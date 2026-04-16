import type { LobbySheetId } from "@/features/lobby/config/lobbyHotspots";
import type { AppPersistState } from "@/features/meta/types/gameState";

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
      return `베이스 ${cafeState.espressoShots}샷 · 원두 ${playerResources.beans}단`;
    case "showcase":
      return stock === 0
        ? "진열 합계 0잔 · 메뉴 제작으로 채워요"
        : `진열 합계 ${stock}잔`;
    case "counter": {
      const offline =
        cafeState.lastOfflineSaleAtMs > 0 && cafeState.lastOfflineSaleCoins > 0
          ? `직전 오프라인 +${cafeState.lastOfflineSaleCoins}코인`
          : null;
      const puzzle =
        puzzleProgress.totalRuns > 0
          ? `최근 퍼즐 ${puzzleProgress.lastRunScore}점`
          : "아직 퍼즐 기록 없음";
      const stockLine =
        stock === 0
          ? "진열 0잔 · 쇼케이스에서 제작"
          : `진열 합계 ${stock}잔`;
      const tail = offline ? `${offline} · ${puzzle}` : puzzle;
      return `${stockLine} · ${tail}`;
    }
    case "puzzle":
      return `하트 ${playerResources.hearts} · 베스트 타일 ${puzzleProgress.bestTile}`;
    default:
      return "";
  }
}
