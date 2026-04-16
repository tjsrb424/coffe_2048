"use client";

import { create } from "zustand";
import {
  canMove,
  createEmptyBoard,
  getHighestTileValue,
  moveBoard,
  spawnInitialPair,
  spawnRandomTile,
} from "@/features/puzzle2048/engine";
import type { Board, Direction } from "@/features/puzzle2048/types";

function boardValueMap(board: Board): Map<string, number> {
  const m = new Map<string, number>();
  for (const row of board) {
    for (const cell of row) {
      if (!cell) continue;
      m.set(cell.id, cell.value);
    }
  }
  return m;
}

function mergePulseStrength(value: number): number {
  // 2,4,8.. 특성상 log2로 “단계”를 추정한다.
  // 과장 금지: 0.0~1.0 범위로 약하게만 스케일링.
  const step = Math.log2(Math.max(2, value));
  // 4~256 사이를 0~1로 부드럽게 매핑 (그 이상은 1로 클램프)
  const t = (step - 2) / 6;
  return Math.min(1, Math.max(0, t));
}

export type PuzzleSessionState = {
  board: Board;
  score: number;
  gameOver: boolean;
  inputLocked: boolean;
  lastMergeCount: number;
  lastScoreDelta: number;
  /** 이번 입력으로 “합체 결과”가 된 타일(id)과 펄스 강도 */
  lastMergePulseById: Record<string, number>;
  startFresh: () => void;
  /** 이동 시도. 성공하면 짧게 입력 잠금 */
  tryMove: (dir: Direction) => void;
};

export const usePuzzleSessionStore = create<PuzzleSessionState>((set, get) => ({
  board: createEmptyBoard(),
  score: 0,
  gameOver: false,
  inputLocked: false,
  lastMergeCount: 0,
  lastScoreDelta: 0,
  lastMergePulseById: {},
  startFresh: () => {
    const board = spawnInitialPair(createEmptyBoard());
    set({
      board,
      score: 0,
      gameOver: false,
      inputLocked: false,
      lastMergeCount: 0,
      lastScoreDelta: 0,
      lastMergePulseById: {},
    });
  },
  tryMove: (dir) => {
    const s = get();
    if (s.inputLocked || s.gameOver) return;
    const moved = moveBoard(s.board, dir);
    if (!moved.moved) return;

    // 엔진을 건드리지 않고 “합체된 타일”만 UI에 전달.
    // mergeLineLeft는 합체 결과 타일의 id를 유지(cur.id)하므로
    // 전/후 value가 증가한 id를 합체 타일로 본다.
    const beforeMap = boardValueMap(s.board);
    const afterMoveMap = boardValueMap(moved.board);
    const lastMergePulseById: Record<string, number> = {};
    for (const [id, nextVal] of afterMoveMap.entries()) {
      const prevVal = beforeMap.get(id);
      if (prevVal !== undefined && nextVal > prevVal) {
        lastMergePulseById[id] = mergePulseStrength(nextVal);
      }
    }

    const spawned = spawnRandomTile(moved.board);
    const nextScore = s.score + moved.scoreDelta;
    const over = !canMove(spawned);
    set({
      board: spawned,
      score: nextScore,
      lastMergeCount: moved.mergeCount,
      lastScoreDelta: moved.scoreDelta,
      lastMergePulseById,
      gameOver: over,
      inputLocked: true,
    });
    window.setTimeout(() => {
      if (get().inputLocked) set({ inputLocked: false });
    }, 175);
    window.setTimeout(() => set({ lastMergeCount: 0 }), 320);
    window.setTimeout(() => set({ lastScoreDelta: 0 }), 520);
    window.setTimeout(() => set({ lastMergePulseById: {} }), 240);
  },
}));

export function readPuzzleOutcomeFromState(state: PuzzleSessionState): {
  score: number;
  highestTile: number;
} {
  return { score: state.score, highestTile: getHighestTileValue(state.board) };
}
