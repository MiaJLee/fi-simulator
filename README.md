# 경제적 자유 시뮬레이터

자산 성장을 시뮬레이션하고 경제적 자유(Financial Independence)까지 걸리는 시간을 계산하는 웹 애플리케이션입니다.

> **Live Demo** &mdash; [https://miajlee.github.io/fi-simulator/](https://miajlee.github.io/fi-simulator/)

## 주요 기능

### 시뮬레이션
- **자산 성장 예측** &mdash; 현재 자산, 수익률, 저축액을 기반으로 연도별 자산 변화를 계산
- **목표 자산 달성 시점** 자동 산출 (나이 포함)
- **물가상승률 반영** &mdash; 명목 자산과 실질 가치를 함께 표시
- **목표 달성 후 시뮬레이션** &mdash; 달성 이후에는 FI 생활비를 자산에서 차감하여 자산 유지 여부 확인
- **자산 하락기 시뮬레이션** &mdash; N년 주기, N% 하락률을 설정하여 시장 폭락 시나리오 테스트 (토글 on/off)

### 시각화
- **자산 성장 추이 차트** &mdash; Canvas 2D API로 직접 렌더링, 마우스 호버 시 연도별 상세 툴팁
- **핵심 지표 카드** &mdash; 월 저축액, 목표 달성 시점, 총 자산, 인출률(SWR)
- **연도별 상세 내역 표** &mdash; 시작 자산, 저축/지출, 투자 수익, 총 자산, 실질 가치

### 내보내기
- **시뮬레이션 결과 이미지 저장** &mdash; 핵심 지표 + 차트를 휴대폰 사이즈(390x844) PNG로 저장
- **연도별 상세 표 이미지 저장** &mdash; 전체 연도 테이블을 별도 PNG로 저장

### 기타
- 입력값 자동 저장 (localStorage)
- 반응형 레이아웃 (모바일/데스크톱)

## 입력 항목

| 구분 | 항목 | 단위 |
|------|------|------|
| 자산 및 수익률 | 현재 자산, 현재 나이, 연간 수익률, 연간 물가상승률 | 만원, 세, % |
| 소득 및 지출 | 월 소득(세후), 월 생활비, 연간 소득 증가율 | 만원, % |
| 목표 설정 | 목표 자산, 목표 달성 후 월 생활비, 시뮬레이션 기간 | 만원, 년 |
| 하락기 시뮬레이션 | 하락 주기, 하락률 | 년, % |

## 기술 스택

- **Framework** &mdash; Next.js 16 (App Router, Static Export)
- **Language** &mdash; TypeScript
- **Styling** &mdash; Tailwind CSS v4
- **Chart** &mdash; Canvas 2D API (외부 라이브러리 없음)
- **Image Export** &mdash; Canvas 2D API (외부 라이브러리 없음)
- **Deploy** &mdash; GitHub Pages (GitHub Actions)
- **Font** &mdash; Noto Sans KR, JetBrains Mono (Google Fonts)

## 프로젝트 구조

```
src/
├── app/
│   ├── globals.css          # 테마 변수 (oatmeal 라이트 테마)
│   ├── layout.tsx           # 루트 레이아웃, 폰트 설정
│   └── page.tsx             # 메인 페이지
├── components/
│   ├── AssetChart.tsx       # 자산 성장 추이 차트 (Canvas)
│   ├── Header.tsx           # 페이지 헤더
│   ├── Footer.tsx           # 페이지 푸터
│   ├── InputField.tsx       # 입력 필드 컴포넌트
│   ├── InputSection.tsx     # 입력 섹션 그룹
│   ├── ResultsPanel.tsx     # 결과 패널 (요약 + 차트 + 표)
│   ├── ResultSummary.tsx    # 핵심 지표 요약
│   ├── ResultsTable.tsx     # 연도별 상세 내역 표
│   ├── SimulationForm.tsx   # 입력 폼 + 실행 버튼
│   ├── StatCard.tsx         # 지표 카드
│   └── Toast.tsx            # 토스트 알림
├── hooks/
│   ├── useLocalStorage.ts   # localStorage 동기화
│   ├── useSimulation.ts     # 시뮬레이션 상태 관리
│   └── useToast.ts          # 토스트 상태 관리
├── lib/
│   ├── chartRenderer.ts     # 차트 렌더링 순수 함수
│   ├── constants.ts         # 기본값, 차트 색상
│   ├── formatters.ts        # 숫자 포맷팅 유틸
│   ├── imageExport.ts       # 이미지 내보내기 (결과 + 표)
│   └── simulation.ts        # 시뮬레이션 엔진
└── types/
    └── simulation.ts        # 타입 정의
```

## 로컬 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 빌드 및 배포

```bash
npm run build
```

`out/` 폴더에 정적 HTML이 생성됩니다. `main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드 후 GitHub Pages에 배포합니다.

### GitHub Pages 설정

레포지토리 **Settings > Pages > Source**를 **GitHub Actions**로 변경해야 합니다.

## 라이선스

MIT
