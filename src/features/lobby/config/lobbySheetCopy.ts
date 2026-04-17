import type { MessageId } from "@locale/messages/ko";
import type { LobbySheetId } from "@/features/lobby/config/lobbyHotspots";

/** 바텀시트 헤더 제목 */
export const LOBBY_SHEET_TITLE_ID: Record<LobbySheetId, MessageId> = {
  roast: "lobby.sheet.roast.title",
  showcase: "lobby.sheet.showcase.title",
  counter: "lobby.sheet.counter.title",
  puzzle: "lobby.sheet.puzzle.title",
};

/** 감성 한 줄(기능 제목과 구분) */
export const LOBBY_SHEET_TAGLINE_ID: Record<LobbySheetId, MessageId> = {
  roast: "lobby.sheet.roast.tagline",
  showcase: "lobby.sheet.showcase.tagline",
  counter: "lobby.sheet.counter.tagline",
  puzzle: "lobby.sheet.puzzle.tagline",
};

export const LOBBY_SHEET_DESCRIPTION_ID: Partial<
  Record<LobbySheetId, MessageId>
> = {
  roast: "lobby.sheet.roast.description",
  showcase: "lobby.sheet.showcase.description",
  counter: "lobby.sheet.counter.description",
  puzzle: "lobby.sheet.puzzle.description",
};

/** 시트 본문 위 짧은 서사 */
export const LOBBY_SHEET_BODY_INTRO_ID: Record<LobbySheetId, MessageId> = {
  roast: "lobby.sheet.roast.body",
  showcase: "lobby.sheet.showcase.body",
  counter: "lobby.sheet.counter.body",
  puzzle: "lobby.sheet.puzzle.body",
};
