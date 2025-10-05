# Keeply 🔗

개인용 메모 및 링크 관리 웹앱 (모바일 중심)

## 📌 프로젝트 소개

Keeply는 인터넷 검색이나 소셜미디어에서 발견한 유용한 링크를 저장하고 관리하는 개인용 웹 애플리케이션입니다.
"나중에 참고하고 싶은 콘텐츠"를 쉽게 저장하고, 다시 볼 때 무슨 내용인지 한눈에 파악할 수 있도록 도와줍니다.

## 🎯 주요 기능

### 현재 구현된 기능 (MVP v1.0)
- ✅ **링크 저장 및 목록 표시** - Linktree 스타일의 깔끔한 버튼 리스트
- ✅ **검색 기능** - 제목, 요약, 도메인으로 빠른 검색
- ✅ **필터링** - 전체/즐겨찾기/최신순 정렬
- ✅ **즐겨찾기** - 중요한 링크 별표 표시
- ✅ **모바일 최적화** - 반응형 디자인으로 모든 기기에서 사용 가능

### 개발 예정 기능
- 🔲 링크 추가/수정/삭제
- 🔲 메타데이터 자동 추출 (OG 태그)
- 🔲 Firebase 실시간 데이터베이스 연동
- 🔲 태그 시스템
- 🔲 PWA (오프라인 지원)

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - 커스텀 스타일 (Bootstrap 5 기반)
- **Vanilla JavaScript (ES6+)** - 프레임워크 없는 순수 JavaScript

### Backend & Database
- **Firebase** - 클라우드 데이터베이스 (설정 예정)
  - Firestore - NoSQL 데이터베이스
  - Hosting - 웹 호스팅

### 개발 도구
- **Python HTTP Server** - 로컬 개발 서버
- **Git** - 버전 관리
- **VS Code** - 코드 에디터

## 🎨 디자인

- **레이아웃**: 단일 컬럼, 중앙 정렬 (최대 680px)
- **스타일**: Linktree 영감, 미니멀리즘
- **색상 테마**: 따뜻한 베이지 핑크 (#f5e9e9) 배경 + 로즈/브라운 톤
- **타이포그래피**: 시스템 폰트 (San Francisco, Segoe UI, Roboto)

## 📁 프로젝트 구조

```
keeply/
├── index.html              # 메인 페이지
├── styles/
│   └── main.css           # 스타일시트
├── scripts/
│   ├── app.js             # 메인 애플리케이션 로직
│   ├── utils.js           # 유틸리티 함수
│   └── firebase.js        # Firebase 연동
├── assets/
│   └── images/            # 이미지 리소스
├── CLAUDE.md              # AI 에이전트 가이드
├── AGENT.md               # AI 사용 매뉴얼
├── GETTING_STARTED.md     # 개발 시작 가이드
├── MVP.md                 # 기능 명세
├── TODO.md                # 할 일 목록
└── README.md              # 이 파일
```

## 🚀 시작하기

### 1. 필요 조건
- Node.js (v18 이상)
- 웹 브라우저 (Chrome, Safari, Firefox 등)
- 텍스트 에디터 (VS Code 추천)

### 2. 설치 및 실행

```bash
# 프로젝트 폴더로 이동
cd keeply

# 개발 서버 실행 (Python)
python3 -m http.server 8000

# 브라우저에서 열기
# http://localhost:8000
```

### 3. 상세한 가이드
- [GETTING_STARTED.md](GETTING_STARTED.md) - 초보자를 위한 단계별 가이드
- [AGENT.md](AGENT.md) - AI와 함께 개발하는 방법

## 📖 문서

- **[MVP.md](MVP.md)** - 1차 MVP 기능 명세서
- **[TODO.md](TODO.md)** - 개발 로드맵 및 할 일 목록
- **[CLAUDE.md](CLAUDE.md)** - Claude Code를 위한 프로젝트 가이드
- **[AGENT.md](AGENT.md)** - AI 에이전트 사용 가이드

## 🔧 개발 현황

**진행률**: 약 30%
- ✅ 기본 구조 완료
- ✅ UI/UX 디자인 완료
- ✅ 검색/필터 기능 완료
- 🔄 Firebase 연동 준비 중
- 🔄 링크 추가 기능 개발 예정

## 📝 주요 변경 사항

### 2025-10-04
- 프로젝트 초기 설정 완료
- 기본 MVP 기능 구현
- Linktree 스타일 UI로 전면 재디자인
- 색상 테마 변경 (#f5e9e9 베이지 핑크)
- 문서화 완료

## 🎓 학습 목적

이 프로젝트는 코딩 초보자의 학습 목적으로 제작되었습니다:
- 웹 개발 기초 학습 (HTML, CSS, JavaScript)
- Firebase 클라우드 서비스 경험
- 실제 사용 가능한 앱 개발 경험
- Git 버전 관리 연습

## 📄 라이선스

개인 프로젝트 - 학습 및 개인 사용 목적

## 🙋‍♀️ 제작자

**JiYoung**
- 프로젝트: Keeply - 개인용 링크 관리 앱
- 목적: 웹 개발 학습 및 실무 경험

---

**Keeply** - 링크를 간직하다 (Keep + ly)
