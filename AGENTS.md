# Coffee 2048 Agent Guide

## Product identity
Coffee 2048 is a cozy web-first game that combines:
- tactile 2048 puzzle play
- calm cafe management
- premium, soft, low-fatigue UI
- touch-first interaction

## Non-negotiable direction
- Lobby is fixed-camera, touch-first hotspot interaction.
- Do not introduce direct movement / virtual pad lobby control.
- Puzzle must feel good before meta becomes large.
- Do not add heavy backend/BM complexity too early.

## Build priorities by phase
1. Puzzle feel
2. Puzzle-to-meta connection
3. Lobby operation loop
4. Growth / save
5. Liveliness / polish
6. Expansion

## Engineering priorities
- Next.js + TypeScript + Tailwind + Framer Motion + Zustand
- Keep domain logic separated
- Prefer pure functions in puzzle engine
- Keep save structure versioned
- Avoid broad rewrites unless asked

## Required output after each task
Every meaningful task must end with:
1. 작업 요약
2. 변경 파일 목록
3. 구현 내용
4. 검증 방법
5. 남은 이슈
6. 다음 추천 작업

## UI quality rules
- Calm, premium, cozy
- No noisy flashy motion
- Strong tactile feedback, short motion
- Mobile-first readability
- Avoid cramped layouts and popup spam
- Visual state changes must be readable

## Doc handling
Keep existing docs intact unless explicitly asked to rewrite them.
When referencing roadmap, use the real file name:
- docs/08_dev_roadmap.md
not the older example name from legacy guidance.