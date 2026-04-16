/** 퍼즐 RNG·경제 수치와 무관한 로비 씬 팔레트만 전환 */

export const LOBBY_THEME_IDS = ["default", "night_jazz", "sakura"] as const;
export type LobbyThemeId = (typeof LOBBY_THEME_IDS)[number];

export function isLobbyThemeId(id: string): id is LobbyThemeId {
  return (LOBBY_THEME_IDS as readonly string[]).includes(id);
}

export function lobbySceneClass(themeId: string): string {
  switch (themeId) {
    case "night_jazz":
      return "from-[#2a2438] via-[#3d3548] to-[#1e1a28]";
    case "sakura":
      return "from-[#fdf2f4] via-[#fce8ee] to-[#f5e6dc]";
    default:
      return "from-cream-200 via-cream-100 to-cream-50";
  }
}

export function lobbyAccentRingClass(themeId: string): string {
  switch (themeId) {
    case "night_jazz":
      return "ring-[#c4b5fd]/35 hover:ring-[#ddd6fe]/55";
    case "sakura":
      return "ring-[#fbcfe8]/70 hover:ring-[#f9a8d4]/55";
    default:
      return "ring-coffee-600/15 hover:ring-accent-soft/40";
  }
}

export function lobbyCounterBlobClass(themeId: string): string {
  switch (themeId) {
    case "night_jazz":
      return "bg-[#a78bfa]/20";
    case "sakura":
      return "bg-[#fda4af]/25";
    default:
      return "bg-accent-soft/20";
  }
}
