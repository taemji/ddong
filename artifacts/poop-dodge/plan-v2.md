# Plan v2 — 비주얼 폴리시 + 사운드 + 리더보드

## 우선순위: 재미 (플레이 경험) 먼저

---

## F1: 버그 & 스펙 수정 (XS · ~30분)

**문제**: idle 화면에서 `bestScore === 0`이면 최고기록 영역 자체가 숨겨짐 → spec은 "없으면 0.00초 표시" 요구

| 파일 | 변경 |
|---|---|
| `components/game/GameOverlay.tsx` | `{bestScore > 0 &&` 조건 제거 → 항상 표시 |

---

## F2: 비주얼 폴리시 (M · ~2h)

### 2-A. 게임 시작 카운트다운 (3 → 2 → 1 → GO!)
START 버튼 클릭 후 3초 카운트다운, 이후 게임 시작

| 파일 | 변경 |
|---|---|
| `types/game.ts` | `GamePhase`에 `'countdown' \| 'paused'` 추가 |
| `hooks/useGameEngine.ts` | countdown 로직 (1초 간격 decrement) + ESC 일시정지/재개 |
| `components/game/GameOverlay.tsx` | countdown 화면 (큰 숫자), paused 화면 추가 |

### 2-B. 게임오버 화면 흔들림 (CSS shake)
충돌 → 게임 컨테이너 0.5초 흔들림 애니메이션

| 파일 | 변경 |
|---|---|
| `app/globals.css` | `@keyframes shake` 추가 |
| `app/game/page.tsx` | phase가 'gameover'로 바뀔 때 `.shake` 클래스 적용 |

---

## F3: 사운드 (M · ~2h)

Web Audio API 기반 절차적 사운드 생성 — 외부 오디오 파일 없음

| 이벤트 | 사운드 | 설명 |
|---|---|---|
| 카운트다운 비프 | 짧은 고음 | 3, 2, 1 각각 |
| GO! | 명랑한 상승 음계 | 게임 시작 신호 |
| 피하기 성공 (near miss) | 낮은 삑 | 똥이 근접 통과 시 |
| 충돌 | 불쾌한 buzz | 맞았을 때 |
| 게임오버 | 하강 멜로디 | 패배 효과음 |

| 파일 | 역할 |
|---|---|
| `lib/sound-engine.ts` | Web Audio API 래퍼 (mute 상태 포함) |
| `components/game/SoundToggle.tsx` | 🔊 / 🔇 토글 버튼 |
| `app/game/page.tsx` | SoundToggle 배치, 사운드 훅 연결 |
| `hooks/useGameEngine.ts` | 이벤트 발생 시 sound-engine 호출 |

---

## F4: 온라인 리더보드 (L · ~4h)

**스택**: Vercel KV (Redis Sorted Set) + Next.js Route Handler

### 데이터 모델
```
// Redis Sorted Set key: "poop-dodge:scores"
// member: JSON.stringify({ nickname, created_at })
// score: elapsedMs (높을수록 상위)

ZADD poop-dodge:scores <elapsedMs> '{"nickname":"...","created_at":"..."}'
ZREVRANGE poop-dodge:scores 0 9 WITHSCORES  // 상위 10명
```

### 닉네임 규칙
- 최대 12자, 영문·한글·숫자만
- 공백 trim, 금칙어 필터 (욕설 목록 단순 검사)

### 플로우
```
게임오버 → 닉네임 입력 → 저장 → 리더보드 표시
                ↓
          이미 입력했으면 저장된 닉네임 재사용 (localStorage)
```

| 파일 | 역할 |
|---|---|
| `app/api/scores/route.ts` | GET (상위 10개 조회) / POST (닉네임+점수 저장) |
| `lib/leaderboard.ts` | API 클라이언트 함수 |
| `lib/nickname-store.ts` | 닉네임 localStorage 저장 |
| `components/game/Leaderboard.tsx` | 순위표 UI |
| `components/game/NicknameInput.tsx` | 닉네임 입력 폼 |
| `components/game/GameOverlay.tsx` | 게임오버 → 닉네임 입력 → 리더보드 표시 플로우 |

### 설정 필요
```
# .env.local (Vercel KV 연결)
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```
→ Vercel 대시보드에서 KV 스토어 생성 후 발급

---

## 구현 순서

```
F1 (버그) → F2-A (카운트다운) → F2-B (흔들림) → F3 (사운드) → F4 (리더보드)
```

의존성: F4는 F1·F2·F3 완료 후 마지막에 구현 (GameOverlay에 가장 많은 변경 집중)

---

## 검증 방법

| Feature | 확인 방법 |
|---|---|
| F1 | 처음 접속 시 best score 영역에 "0.00s" 표시 |
| F2-A | START 클릭 → 3·2·1·GO! 표시 후 게임 시작 |
| F2-B | 충돌 시 게임 컨테이너가 0.5초간 흔들림 |
| F3 | 충돌 시 buzz 소리, 뮤트 버튼으로 끄기 가능 |
| F4 | 게임오버 후 닉네임 입력 → 리더보드에 점수 반영 |
