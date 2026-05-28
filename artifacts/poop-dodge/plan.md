# 똥피하기 (Poop Dodge) 구현 계획

## 아키텍처 결정

| 결정 | 선택 | 이유 |
|---|---|---|
| 렌더링 | HTML Canvas + `requestAnimationFrame` | 60fps 게임 루프, 픽셀 단위 제어 |
| 게임 로직 | 순수 함수 (`lib/game-engine.ts`) | Vitest로 충돌·이동 로직 단독 검증 가능 |
| 상태 관리 | `useRef` (게임 루프) + `useState` (UI 전환) | RAF 콜백 안에서 closure 재생성 없이 최신 상태 참조 |
| 키보드 핸들러 | `useRef` 패턴 (stable subscription) | 매 렌더마다 재구독 방지 |
| 터치 이벤트 | `{ passive: true }` | 스크롤 지연 없이 버튼 탭 즉시 처리 |
| localStorage | 버전 키 + try-catch 래핑 | Incognito 환경 대응, 스키마 진화 가능 |
| 픽셀 아트 | Canvas `drawRect` (색상 팔레트 4-6색) | 외부 에셋 없이 코드로 완전 제어 |
| 페이지 위치 | `app/game/page.tsx` (`"use client"`) | 게임 전체가 클라이언트 전용, RSC 불필요 |

## 인프라 리소스

None

## 데이터 모델

### GameState
- `phase: 'idle' | 'playing' | 'gameover'`
- `lane: 1 | 2 | 3 | 4 | 5` (캐릭터 현재 레인)
- `elapsedMs: number` (생존 시간 ms)
- `poops: Poop[]`
- `bestScore: number` (ms)
- `isNewRecord: boolean`

### Poop
- `id: string`
- `lane: 1 | 2 | 3 | 4 | 5`
- `y: number` (0 = 상단, 1 = 하단)
- `speed: number` (초당 y 증가량)

### BestScore (localStorage)
- key: `poop-dodge:best:v1`
- value: `{ ms: number }`

## 필요 스킬

| 스킬 | 적용 Task | 용도 |
|---|---|---|
| `vercel-react-best-practices` — event-handler-refs | Task 5, 6 | 키보드 핸들러 ref 패턴 |
| `vercel-react-best-practices` — client-passive-event-listeners | Task 6 | 터치 버튼 passive 처리 |
| `vercel-react-best-practices` — client-localstorage-schema | Task 2 | 버전 키 + try-catch |
| `next-best-practices` — directives | Task 4 | `"use client"` 위치 결정 |
| `shadcn` — button | Task 4, 6 | 시작·재시작·모바일 버튼 |

## 영향 받는 파일

| 파일 경로 | 변경 유형 | 관련 Task |
|---|---|---|
| `types/game.ts` | New | Task 1 |
| `lib/game-engine.ts` | New | Task 1 |
| `lib/game-engine.test.ts` | New | Task 1 |
| `lib/best-score-store.ts` | New | Task 2 |
| `lib/best-score-store.test.ts` | New | Task 2 |
| `lib/pixel-art.ts` | New | Task 3 |
| `hooks/useGameEngine.ts` | New | Task 5 |
| `components/game/GameCanvas.tsx` | New | Task 4 |
| `components/game/GameOverlay.tsx` | New | Task 4 |
| `components/game/MobileControls.tsx` | New | Task 6 |
| `app/game/page.tsx` | New | Task 4 |

---

## Tasks

### Task 1: 게임 타입 + 순수 함수 엔진

- **담당 시나리오**: Scenario 3 (레인 이동 경계 로직), Scenario 5 (난이도 계산), Scenario 6 (충돌 판정)
- **크기**: S (2 파일)
- **의존성**: None
- **참조**:
  - CLAUDE.md `types/` → `lib/` 의존성 순서
- **구현 대상**:
  - `types/game.ts` — `GamePhase`, `Poop`, `GameState` 타입
  - `lib/game-engine.ts` — 순수 함수 5개: `moveLane`, `spawnPoop`, `updatePoops`, `checkCollision`, `getDifficulty`
  - `lib/game-engine.test.ts` — 각 함수별 단위 테스트
- **수용 기준**:
  - [ ] `moveLane(3, 'left')` → `2` 반환
  - [ ] `moveLane(1, 'left')` → `1` 반환 (경계)
  - [ ] `moveLane(5, 'right')` → `5` 반환 (경계)
  - [ ] `checkCollision({ lane: 3, y: 0.85 }, 3)` → `true`
  - [ ] `checkCollision({ lane: 3, y: 0.5 }, 3)` → `false`
  - [ ] `checkCollision({ lane: 2, y: 0.9 }, 3)` → `false` (다른 레인)
  - [ ] `getDifficulty(0)` < `getDifficulty(10000)` (속도 증가 확인)
  - [ ] `getDifficulty(20000).maxPoops` ≥ 2
- **검증**: `bun run test -- game-engine`

---

### Task 2: 최고 기록 저장소

- **담당 시나리오**: Scenario 7 (최고 기록 갱신 로직), Scenario 8 (영속성)
- **크기**: S (2 파일)
- **의존성**: None
- **참조**:
  - `vercel-react-best-practices` — client-localstorage-schema (버전 키 `poop-dodge:best:v1`, try-catch 래핑)
- **구현 대상**:
  - `lib/best-score-store.ts` — `getBestScore()`, `setBestScore(ms)`, `isNewRecord(ms)`
  - `lib/best-score-store.test.ts`
- **수용 기준**:
  - [ ] 저장 기록 없을 때 `getBestScore()` → `0`
  - [ ] `setBestScore(28450)` 후 `getBestScore()` → `28450`
  - [ ] `isNewRecord(30000)` (기존 28450) → `true`
  - [ ] `isNewRecord(25000)` (기존 28450) → `false`
  - [ ] localStorage 접근 불가 환경에서도 에러 없이 `0` 반환
- **검증**: `bun run test -- best-score-store`

---

### Checkpoint: Tasks 1–2 이후
- [ ] `bun run test` 전체 통과
- [ ] `bun run build` 성공
- [ ] 게임 로직 순수 함수 전체 검증 완료

---

### Task 3: 픽셀 아트 스프라이트 정의

- **담당 시나리오**: 비주얼 명세 (spec.md "비주얼 명세" 섹션 — 픽셀 아트 스타일, 캐릭터·똥·배경·레인)
- **크기**: S (1 파일)
- **의존성**: None
- **참조**:
  - spec.md 비주얼 명세 — 4-6색 팔레트, 갈색 계열 똥, 어두운 배경
- **구현 대상**:
  - `lib/pixel-art.ts` — `drawCharacter(ctx, x, y, frame)`, `drawPoop(ctx, x, y)`, `drawBackground(ctx, w, h)`, `drawLanes(ctx, w, h, laneCount)`
  - 스프라이트는 `number[][]` 픽셀 맵으로 정의, `drawRect` 단위로 렌더
- **수용 기준**:
  - [ ] `drawCharacter` 호출 시 Canvas에 최소 1개 이상의 색상 블록이 그려진다
  - [ ] `drawPoop` 호출 시 갈색 계열 픽셀이 Canvas에 그려진다
- **검증**: Human review — `bun run dev` 후 `/game` 접근, 픽셀 아트 시각 확인, 스크린샷 `artifacts/poop-dodge/evidence/task-3-sprites.png` 저장

---

### Task 4: /game 페이지 + 시작 화면

- **담당 시나리오**: Scenario 1 (시작 화면 진입) — full
- **크기**: M (3 파일)
- **의존성**: Task 2 (getBestScore), Task 3 (pixel-art)
- **참조**:
  - `next-best-practices` — directives (`"use client"` 페이지 최상단)
  - `shadcn` — Button 컴포넌트 (시작 버튼)
  - `wireframe.html` ① 시작 화면
- **구현 대상**:
  - `app/game/page.tsx` — `"use client"`, GameCanvas + GameOverlay 조합
  - `components/game/GameCanvas.tsx` — Canvas ref, 정적 배경+스프라이트 렌더 (idle 상태)
  - `components/game/GameOverlay.tsx` — `phase === 'idle'` 분기: 타이틀, 최고기록, 시작 버튼
- **수용 기준**:
  - [ ] `/game` 접근 시 "시작" 버튼이 화면에 보인다
  - [ ] "최고기록" 레이블과 `0.00초` 값이 표시된다 (저장 기록 없을 때)
  - [ ] 캔버스에 배경과 캐릭터가 정지 상태로 렌더된다
  - [ ] idle 상태에서 Canvas 애니메이션이 동작하지 않는다 (점수 카운터 `0.00초` 고정)
- **검증**: `bun run test -- GameOverlay` (RTL) + Browser MCP — `/game` 접근 후 "시작" 버튼·"최고기록" 텍스트 단언, 스크린샷 `artifacts/poop-dodge/evidence/task-4-start.png`

---

### Task 5: 게임 루프 + 낙하 + 게임 시작

- **담당 시나리오**: Scenario 2 (게임 시작) — 모바일 버튼 표시 기준 제외 (→ Task 6)
- **크기**: M (2 파일)
- **의존성**: Task 1 (game-engine), Task 4 (GameCanvas)
- **참조**:
  - `vercel-react-best-practices` — advanced-event-handler-refs (`useRef` + RAF 루프)
- **구현 대상**:
  - `hooks/useGameEngine.ts` — `startGame()`, RAF 루프, `elapsedMs` 증가, `spawnPoop` 호출, `updatePoops` 호출, `GameState` 반환
  - `components/game/GameCanvas.tsx` — 매 프레임 `clearRect` + drawBackground + drawLanes + drawPoop + drawCharacter
- **수용 기준**:
  - [ ] "시작" 버튼 클릭 후 점수 카운터가 `0.00초`부터 증가한다
  - [ ] 캐릭터가 레인 3(중앙) 하단에 위치한다
  - [ ] 1초 이내 첫 번째 똥이 화면 상단에서 낙하를 시작한다
- **검증**: Browser MCP — "시작" 클릭, 2초 대기, 점수 ≥ `2.00초` 단언 + 똥 낙하 확인, 스크린샷 `artifacts/poop-dodge/evidence/task-5-playing.png`

---

### Task 6: 레인 이동 (PC 키보드 + 모바일 버튼)

- **담당 시나리오**: Scenario 3 (PC 이동) — full, Scenario 4 (모바일 이동) — full, Scenario 2 (모바일 버튼 표시 기준 포함)
- **크기**: S (2 파일)
- **의존성**: Task 5 (useGameEngine)
- **참조**:
  - `vercel-react-best-practices` — advanced-event-handler-refs (keydown 핸들러)
  - `vercel-react-best-practices` — client-passive-event-listeners (터치 이벤트 passive)
  - `shadcn` — Button (← → 버튼)
  - `wireframe.html` ② 플레이 화면 하단 버튼
- **구현 대상**:
  - `hooks/useGameEngine.ts` — `keydown` 리스너 추가 (`ArrowLeft`/`ArrowRight` → `moveLane`)
  - `components/game/MobileControls.tsx` — ← → Button, `playing` 상태에서만 표시, `onTouchStart` passive
- **수용 기준**:
  - [ ] `ArrowLeft` 키 → 캐릭터가 왼쪽으로 한 레인 이동 (Canvas 위치 변경)
  - [ ] `ArrowRight` 키 → 캐릭터가 오른쪽으로 한 레인 이동
  - [ ] 레인 1에서 `ArrowLeft` → 위치 변화 없음
  - [ ] 레인 5에서 `ArrowRight` → 위치 변화 없음
  - [ ] 모바일 ← → 버튼이 `playing` 상태에서만 표시된다
  - [ ] `idle`·`gameover` 상태에서 ← → 버튼이 보이지 않는다
- **검증**: `bun run test -- MobileControls` (RTL — phase별 버튼 가시성) + Browser MCP — 키보드 입력 후 캐릭터 레인 이동 확인

---

### Checkpoint: Tasks 3–6 이후
- [ ] `bun run test` 전체 통과
- [ ] `bun run build` 성공
- [ ] `/game` 시작 → 키보드로 이동 → 똥 낙하가 end-to-end로 동작
- 참고: 난이도 자동 증가(Scenario 5)는 Task 9에서 완성 — 이 시점에서는 단일 속도로 낙하

---

### Task 7: 충돌 → 게임오버 + 재시작

- **담당 시나리오**: Scenario 6 (충돌→게임오버) — full, Scenario 9 (재시작) — full
- **크기**: S (2 파일)
- **의존성**: Task 5 (useGameEngine), Task 4 (GameOverlay)
- **참조**:
  - `wireframe.html` ③ 게임오버 화면
- **구현 대상**:
  - `hooks/useGameEngine.ts` — RAF 루프 안에서 `checkCollision` 호출, 충돌 시 `phase → 'gameover'`, RAF 취소
  - `components/game/GameOverlay.tsx` — `phase === 'gameover'` 분기: GAME OVER 텍스트, 이번 기록, 최고기록, "다시 시작" 버튼 → `resetGame()`; Canvas 위 `position: absolute` 반투명 오버레이로 게임 화면 dim 처리
- **수용 기준**:
  - [ ] 충돌 즉시 점수 카운터가 멈춘다
  - [ ] "GAME OVER" 텍스트(또는 동등 메시지)가 표시된다
  - [ ] 이번 생존 시간(초)이 오버레이에 표시된다
  - [ ] 최고 기록이 함께 표시된다
  - [ ] "다시 시작" 버튼이 표시된다
  - [ ] 모바일 ← → 버튼이 `gameover` 상태에서 숨겨진다
  - [ ] "다시 시작" 클릭 → 점수 `0.00초`부터 재시작, 캐릭터 레인 3, 이전 똥 없음
- **검증**: Browser MCP — 게임 진행, 충돌 유도, 게임오버 텍스트·점수·재시작 버튼 단언, 스크린샷 `artifacts/poop-dodge/evidence/task-7-gameover.png`

---

### Task 8: 최고 기록 갱신 + 신기록 배지

- **담당 시나리오**: Scenario 7 (최고 기록 갱신) — full, Scenario 8 (영속성) — full
- **크기**: S (2 파일)
- **의존성**: Task 2 (best-score-store), Task 7 (gameover state)
- **참조**:
  - `wireframe.html` ④ 신기록 화면
- **구현 대상**:
  - `hooks/useGameEngine.ts` — `gameover` 진입 시 `isNewRecord` 체크, `setBestScore` 호출, `isNewRecord` 플래그 state에 반영
  - `components/game/GameOverlay.tsx` — `isNewRecord === true` 분기: "★ 신기록! ★" 배지 표시, 갱신된 최고기록 값
- **수용 기준**:
  - [ ] 이번 기록 > 기존 최고기록 → 최고기록 값이 이번 기록으로 바뀐다
  - [ ] "★ 신기록!" 또는 동등 강조 표시가 나타난다
  - [ ] 이번 기록 ≤ 기존 최고기록 → 강조 표시 없음
  - [ ] 새로고침 후 시작 화면의 최고기록이 갱신된 값과 일치한다
- **검증**: Browser MCP — 신기록 달성, 배지 텍스트 단언, 새로고침 후 시작 화면 최고기록 값 단언, 스크린샷 `artifacts/poop-dodge/evidence/task-8-newrecord.png`

---

### Task 9: 난이도 자동 증가

- **담당 시나리오**: Scenario 5 (난이도 자동 증가) — full
- **크기**: S (1 파일)
- **의존성**: Task 5 (useGameEngine — RAF 루프 안에 getDifficulty 훅 포인트 준비됨)
- **참조**:
  - `lib/game-engine.ts` — `getDifficulty(elapsedMs)` (Task 1에서 구현)
- **구현 대상**:
  - `hooks/useGameEngine.ts` — RAF 루프에서 `getDifficulty(elapsedMs)` 로 spawn 빈도·속도 동적 조정
- **수용 기준**:
  - [ ] 10초 시점 낙하 속도가 시작 시점보다 눈에 띄게 빠르다
  - [ ] 20초 이후 두 개 이상의 똥이 동시에 화면에 존재할 수 있다
- **검증**: Human review — `bun run dev` 후 20초 이상 생존, 속도 증가·다중 낙하 시각 확인, 스크린샷 `artifacts/poop-dodge/evidence/task-9-difficulty.png`

---

### Checkpoint: Tasks 7–9 이후 (최종)
- [ ] `bun run test` 전체 통과
- [ ] `bun run build` 성공
- [ ] Scenario 1–9 전체 end-to-end 동작: 시작 → 이동 → 충돌 → 신기록 → 재시작 → 난이도 증가

---

## 미결정 항목

없음
