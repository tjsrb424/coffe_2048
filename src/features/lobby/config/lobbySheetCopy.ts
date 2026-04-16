import type { LobbySheetId } from "@/features/lobby/config/lobbyHotspots";

export const LOBBY_SHEET_TITLE: Record<LobbySheetId, string> = {
  roast: "로스터",
  showcase: "쇼케이스",
  counter: "카운터",
  puzzle: "퍼즐",
};

/** 감성 한 줄(기능 제목과 구분) */
export const LOBBY_SHEET_TAGLINE: Record<LobbySheetId, string> = {
  roast: "베이스를 준비해요",
  showcase: "메뉴를 만들어 진열해요",
  counter: "판매 흐름을 확인해요",
  puzzle: "한 판 시작",
};

export const LOBBY_SHEET_DESCRIPTION: Partial<Record<LobbySheetId, string>> = {
  roast: "원두 → 샷. 부족하면 먼저 채워요.",
  showcase: "제작 → 진열. 가능한 카드부터 눌러요.",
  counter: "진열이 비면 쇼케이스로 복구해요.",
  puzzle: "하트 1개로 시작해요.",
};

/** 시트 본문 위 짧은 서사 */
export const LOBBY_SHEET_BODY_INTRO: Record<LobbySheetId, string> = {
  roast: "원두를 넣고 베이스 샷을 만들어 주세요.",
  showcase: "만들 수 있는 메뉴부터 눌러 재고를 채워요.",
  counter: "판매가 들어오는지, 진열이 남았는지 확인해요.",
  puzzle: "원두를 모으러 한 판 들어가요.",
};
