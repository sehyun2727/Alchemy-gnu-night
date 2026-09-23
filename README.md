# GNU NIGHT in Gwangju — 홍보 사이트

2026.10.31 (토) PM 06:00 · 하멜아트홀 · Kawarimono | Ameu | Alchemy
J-POP BAND COVER LIVE 연합공연 홍보용 정적 사이트 (HTML/CSS/JS, 빌드 없음).

## 실행 / 배포
- `index.html` 을 그대로 열면 동작합니다. (폰트만 Google Fonts에서 받으므로 온라인 상태 권장)
- GitHub Pages: 폴더 내용을 저장소 루트에 올리고 Pages 활성화.

## 폴더
```
gnu-night-site/
├─ index.html
├─ css/style.css
├─ js/main.js          ← SETS 배열 = 셋리스트 데이터 (제목/읽기/아티스트/설명/고장 종류)
└─ img/
   ├─ hero-gnu.jpg          인트로: 기타 넥 뿔의 누(GNU)
   ├─ walk-gnu.jpg          RUNNING ORDER 에서 옆으로 걸어가는 누
   ├─ emblem-akg.jpg        01 Alchemy Kung-Fu Generation — 플라스크 + 기타
   ├─ emblem-ameu.jpg       02 Ameu — 심벌즈 우산, 위로 올라가는 비
   ├─ emblem-kansoku.jpg    03 관측불가 — 등롱 렌즈 망원경
   ├─ emblem-kawarimono.jpg 04 Kawarimono — 녹아 흐르는 LP (※ 코드로 그린 임시 이미지, 교체 권장)
   ├─ splat-teal/yellow/red.png, grain.png   포스터 페인트 배경 레이어
   └─ poster.jpg            ← 없음. 원본 포스터를 이 이름으로 넣으면 하단에 자동 표시
```

## 연출
| 구간 | 연출 |
|---|---|
| HERO | 스크롤하면 GNU NIGHT 글자가 페인트처럼 흘러내리고 누가 다가옴 |
| 왕관 | 화면 안 섹션 제목 위로 왕관이 날아가 앉음. 제목이 없으면 좌상단 로고로 귀환 |
| THE NIGHT | 공연까지 카운트다운(KST) + 정보 카드가 180° 뒤집힌 채 들어와 바로 섬 |
| RUNNING ORDER | 세로 스크롤 → 가로 이동. 누가 옆으로 걸으며 4개 무대를 지나감 (위로 스크롤하면 뒤돌아 걸음) |
| SETLIST | 팀별 턴테이블. 스크롤 = 판 회전, 바늘 아래 곡이 오른쪽에 설명됨. 상단 네비에 TRACK n/22 표시 |
|  ↳ 고장 | AKG: 역회전 + 바늘 반대편 + 제목이 リライト(스크램블) / Ameu: 비 / 관측불가: 바늘 아래 곡만 선명, 나머지 흐림 / Kawarimono: 중심이 어긋나 흔들리는 판 |
| TICKET | 스크롤하면 표가 절취선에서 찢어짐. 왼쪽 온라인 5,000 / 오른쪽 현장 7,000 |
| VENUE | 주소가 거꾸로·뒤집혀 있다가 제자리로 돌아옴 |
| FOOTER | 반응형 무한 마키 2줄 |

## 교체가 필요한 것 (화면에 노란 점선 테두리로 표시됨 — `data-placeholder` 속성을 지우면 테두리도 사라짐)
| 위치 | 내용 |
|---|---|
| TICKET `예매하기 →` | 실제 예매 링크 (`index.html` 의 `.btn` href) |
| VENUE `DOOR` | 입장 시작 시간 |
| BANDS | Kawarimono · Ameu 한 줄 소개, Instagram 링크 3개, Alchemy 홈페이지 링크 |
| img/poster.jpg | 원본 포스터 (선택) |
| img/emblem-kawarimono.jpg | 임시 이미지 → 실제 이미지로 교체 권장 |
| js/main.js `SETS` | 곡 설명(`d`) 문구 검수. 특히 `AIZO` 는 곡 정보 확인 후 문구 보강 |

## 셋리스트 수정 방법
`js/main.js` 상단 `SETS` 배열에서 곡 객체를 추가/삭제/순서변경하면 턴테이블·목록·트랙 카운터가 모두 자동 반영됩니다.
공연 시작 시각은 `SHOW_START` 한 줄.
