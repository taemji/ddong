# learnings — poop-dodge

---
category: code-review
applied: rule
---
## RAF 루프 내 lane은 반드시 별도 ref로 관리

**상황**: Task 5 구현 후 code-reviewer가 Critical로 지적. tick() 안에서 `stateRef.current.lane`을 읽는데, `move()`는 `setState`를 통해 lane을 업데이트하므로 React commit 전 프레임에서 이전 lane으로 충돌 판정이 실행된다.
**판단**: `laneRef`를 별도로 두어 `move()`에서 즉시 동기 업데이트. tick()은 `laneRef.current`만 참조. setState는 UI 렌더 용도로만 사용.
**다시 마주칠 가능성**: 높음 — RAF 루프 + React state 조합에서 항상 발생할 수 있는 패턴.

---
category: code-review
applied: not-yet
---
## 첫 프레임 spawn 타이밍 — lastSpawnRef 초기값

**상황**: `lastSpawnRef.current = 0`으로 초기화하면 `timestamp - 0 ≥ spawnInterval`이 첫 프레임에서 즉시 통과해 게임 시작 직후 똥이 뜬다. 의도치 않은 동작.
**판단**: `lastSpawnRef.current = null`로 초기화하고, tick에서 null이면 현재 timestamp를 기록하고 스폰 건너뜀. 한 interval 뒤 첫 스폰.
**다시 마주칠 가능성**: 중간 — 타이머 기반 game loop 패턴에서 재발 가능.

---
category: tooling
applied: rule
---
## vitest exclude에 e2e/** 추가 필요

**상황**: `bun run test` 전체 실행 시 `e2e/smoke.spec.ts`가 Playwright 테스트인데 Vitest가 잡아서 실패.
**판단**: `vitest.config.ts`의 `exclude`에 `"e2e/**"` 추가. 빌드 전부터 이 프로젝트에 존재하던 문제.
**다시 마주칠 가능성**: 높음 — 새 프로젝트 세팅 시 반드시 체크해야 하는 항목.

---
category: code-review
applied: not-yet
---
## Canvas 게임에서 `resetGame`은 `startGame`의 alias

**상황**: plan에서 별도 `resetGame` 함수를 기획했으나 구현하면 `startGame()` 호출만 하는 wrapper가 됨.
**판단**: `resetGame: startGame`으로 반환. 불필요한 useCallback 래핑 제거.
**다시 마주칠 가능성**: 낮음 — 이 게임 특유의 단순한 상태머신 구조 때문.

---
category: task-ordering
applied: not-yet
---
## Tasks 7·8·9는 5와 함께 구현하는 것이 자연스럽다

**상황**: plan에서 충돌(Task 7), 최고기록(Task 8), 난이도(Task 9)를 별도 Task로 분리했으나, 실제로는 `useGameEngine.ts` RAF 루프에 한 번에 함께 들어가는 로직이라 분리 커밋 효과가 없었음.
**판단**: 이 규모의 게임 루프는 Task 5 구현 시 충돌·기록·난이도를 함께 포함하고 GameOverlay도 같이 완성하는 게 더 자연스럽다. plan은 4개 Task였지만 실제 2개 커밋으로 완성.
**다시 마주칠 가능성**: 중간 — 단일 루프에 모든 게임 로직이 집중되는 아케이드 게임 구조에서 재발.
