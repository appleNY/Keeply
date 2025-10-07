# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요
- **프로젝트명**: Keeply
- **목적**: 개인용 메모 및 링크 관리 웹앱 (모바일 중심)
- **사용자 수준**: 코딩 초보자 - 교육적 접근 필요

## 기술 스택
- **프론트엔드**: Vanilla JavaScript (ES6 Modules)
  - 프레임워크 없이 순수 JavaScript를 사용하여 학습 효과 극대화
  - ES6 모듈 시스템으로 코드 구조화
- **UI 프레임워크**: Bootstrap 5.3
  - CDN 방식으로 빠르게 시작
  - 반응형 모바일 우선 디자인
  - 커스텀 CSS로 스타일 확장
- **백엔드/데이터베이스**: Firebase
  - **Firestore**: 실시간 NoSQL 데이터베이스
  - Firebase SDK CDN 방식 사용 (버전 10.7.1)
  - 빠른 프로토타이핑과 배포에 최적화

## 디자인 시스템
### 색상 팔레트 (청록/보라 테마)
- **배경**: 청록→보라 그라데이션 `linear-gradient(135deg, #e8f5f7 0%, #f0e6f6 100%)`
- **주요 색상**:
  - 보라색: `#7b61ff` (테두리, 강조)
  - 진한 보라: `#4a3f8f` (제목, 주요 텍스트)
  - 청록색: `#1a9b9f` (설명, 링크 테두리)
  - 연한 보라: `#a599d9` (placeholder, 보조 텍스트)
- **버튼**: 보라→청록 그라데이션 `linear-gradient(135deg, #7b61ff 0%, #1a9b9f 100%)`

### 타이포그래피
- **웹폰트**: Noto Sans KR (한글) + Poppins (영문)
  - Google Fonts CDN 사용
  - 부드럽고 모던한 느낌
- **프로필 이름**: 3rem (모바일: 2.2rem)
  - 그라데이션 텍스트 효과 (보라 → 연보라)
- **프로필 소개**: 1.4rem (모바일: 1.1rem)
- **검색/필터**: 1.1rem (모바일: 16px - 자동 확대 방지)
- **링크 제목**: 1.35rem (모바일: 1.2rem)
  - 그라데이션 텍스트 효과
- **링크 설명**: 1.05rem (모바일: 0.98rem)
- **추가 버튼**: 1.25rem (모바일: 1.15rem)

## 커뮤니케이션 원칙
1. **한국어 사용**: 모든 응답은 한국어로 작성
2. **쉬운 용어**: 전문 용어 사용 시 반드시 설명 추가
3. **상세한 환경 설명**: 명령어 실행 시 어디서(터미널/브라우저/에디터) 실행하는지 명시
4. **단계별 설명**: 각 작업을 작은 단계로 나누어 설명
5. **이유 설명**: "왜" 이렇게 하는지 교육적 맥락 제공

## 응답 형식 예시
```
[터미널에서 실행] npm install
→ 이 명령어는 package.json에 명시된 라이브러리들을 설치합니다.
→ node_modules 폴더가 생성되며, 여기에 필요한 코드들이 저장됩니다.
```

## 프로젝트 구조
```
keeply/
├── index.html         # 메인 HTML 파일
├── scripts/           # JavaScript 파일들
│   ├── app.js         # 메인 애플리케이션 로직
│   ├── firebase.js    # Firebase 연동 및 데이터베이스 함수
│   └── utils.js       # 유틸리티 함수들
├── styles/            # CSS 파일들
│   └── main.css       # 커스텀 스타일
├── assets/            # 이미지, 아이콘 등
├── CLAUDE.md          # AI 개발 도우미 가이드
├── AGENT.md           # 사용자를 위한 AI 협업 가이드
└── TODO.md            # 프로젝트 할 일 목록
```

## 개발 환경 설정
- **에디터**: VS Code 추천 (또는 사용자가 선호하는 에디터)
- **버전 관리**: Git 설치 필요
- **웹 서버**: Live Server 확장 프로그램 사용 권장
  - VS Code에서 "Live Server" 확장 설치
  - HTML 파일에서 우클릭 → "Open with Live Server"
  - 파일 변경 시 자동으로 브라우저 새로고침
- **Firebase 설정**:
  - Firebase Console에서 프로젝트 생성
  - Firestore Database 활성화
  - `scripts/firebase.js`에 Firebase 설정 정보 입력

## 주요 기능 요구사항
1. 메모 작성/수정/삭제
2. 링크 저장 및 관리
3. 모바일 최적화 UI (아이폰 16 Pro 중심)
4. 간단하고 직관적인 사용자 경험

## 모바일 최적화 지침
이 프로젝트는 아이폰 16 Pro를 주요 타겟으로 모바일 최적화되었습니다.

### Safe Area 대응
- `viewport-fit=cover` 설정
- `env(safe-area-inset-*)` 사용으로 노치/Dynamic Island/홈 인디케이터 영역 회피

### 터치 최적화
- 모든 터치 가능한 요소는 최소 44x44px 크기 유지
- 검색/필터 입력: 최소 48px 높이
- 링크 카드: 최소 120px 높이
- 즐겨찾기 아이콘: 44x44px 터치 영역

### UI 패턴
- 하단 고정 버튼: '+ 새 링크 추가' 버튼이 화면 하단 고정 (엄지 도달 영역)
- 입체적 카드 디자인: 그림자와 hover 효과
- 터치 하이라이트: 보라색 계열 (`rgba(123, 97, 255, 0.2)`)

### 성능 최적화
- 이미지 lazy loading (`loading="lazy"`)
- iOS 스크롤 성능 최적화 (`-webkit-overflow-scrolling: touch`)
- 입력 필드 자동 확대 방지 (최소 16px font-size)

### PWA 지원
- `manifest.json` 포함
- "홈 화면에 추가" 가능
- 앱 아이콘 및 테마 색상 설정

## 코드 작성 시 주의사항
- **주석**: 코드에 한국어 주석을 충분히 작성
- **변수명**: 영어로 작성하되 의미가 명확하게 (예: `linkList`, `addButton`)
- **모듈화**: ES6 모듈 시스템 사용 (`import`/`export`)
- **점진적 개발**: 한 번에 작은 기능씩 구현하여 이해도 향상
- **테스트**: 각 단계마다 브라우저에서 동작 확인
- **Bootstrap 활용**: 가능하면 Bootstrap 컴포넌트 먼저 사용, 필요시 커스텀 CSS 추가
- **Firebase 연동**: 모든 데이터베이스 작업은 `scripts/firebase.js`의 함수 사용

## 학습 중심 개발
- 새로운 개념 도입 시 반드시 설명 추가
- 실행 결과를 확인하는 방법 안내
- 에러 발생 시 에러 메시지 해석 도움
- 대안적인 방법도 함께 제시하여 선택권 제공

## TODO 리스트 관리 원칙 (매우 중요!)

### 작업 시작 시
1. **새로운 작업을 시작하기 전**, 반드시 TodoWrite 도구를 사용하여 할 일 목록 생성
2. 작업을 여러 단계로 나누어 각각을 TODO 항목으로 등록
3. 첫 번째 작업 항목을 "in_progress" 상태로 설정하고 시작

### 작업 진행 중
1. **각 작업이 완료될 때마다** 즉시 해당 TODO 항목을 "completed"로 업데이트
2. 다음 작업 항목을 "in_progress"로 변경
3. 작업 중 새로운 할 일이 발견되면 TODO 리스트에 추가

### 작업 완료 시
1. 모든 작업이 완료되면 TODO 리스트 정리
2. 필요시 TODO.md 파일도 함께 업데이트
3. 완료된 작업 내용을 사용자에게 요약 제공

### 예시
```
사용자: "로그인 페이지 만들어줘"

AI 행동:
1. TodoWrite 실행:
   - "로그인 페이지 HTML 작성" (in_progress)
   - "로그인 CSS 스타일 작성" (pending)
   - "로그인 JavaScript 로직 작성" (pending)

2. HTML 작성 완료 후:
   - "로그인 페이지 HTML 작성" (completed) ✅
   - "로그인 CSS 스타일 작성" (in_progress)

3. 모든 작업 완료 후:
   - 최종 TODO 상태 업데이트
   - 사용자에게 완료 보고
```

**반드시 지켜야 할 규칙:**
- ❌ TODO 리스트 없이 작업 시작 금지
- ❌ 작업 완료 후 TODO 업데이트 누락 금지
- ✅ 항상 진행 상황을 TODO로 추적
- ✅ 한 번에 하나의 작업만 "in_progress" 상태 유지
