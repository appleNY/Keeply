# Keeply 🔗

개인용 메모 및 링크 관리 웹앱 (모바일 중심)

## 📌 프로젝트 소개

Keeply는 인터넷 검색이나 소셜미디어에서 발견한 유용한 링크를 저장하고 관리하는 개인용 웹 애플리케이션입니다.
"나중에 참고하고 싶은 콘텐츠"를 쉽게 저장하고, 다시 볼 때 무슨 내용인지 한눈에 파악할 수 있도록 도와줍니다.

## 🎯 주요 기능

### 현재 구현된 기능 (v1.5)
- ✅ **사용자 인증** - Firebase Authentication (이메일/비밀번호)
- ✅ **링크 관리** - 추가/수정/삭제 기능 완비
- ✅ **메타데이터 자동 추출** - URL 입력 시 제목/설명/썸네일 자동 가져오기
- ✅ **검색 기능** - 제목, 요약, 도메인으로 빠른 검색
- ✅ **필터링** - 전체/즐겨찾기/최신순 정렬
- ✅ **즐겨찾기** - 중요한 링크 별표 표시
- ✅ **메모 기능** - 링크별 개인 메모 추가
- ✅ **Firebase 연동** - Firestore 실시간 데이터베이스 (사용자별 데이터 격리)
- ✅ **모바일 최적화** - iPhone 16 Pro 중심 최적화, 스와이프 삭제 지원

### 개발 예정 기능
- 🔲 프로필 시스템 (고유 사용자명, 프로필 이미지)
- 🔲 공개/비공개 설정 (프로필 및 링크별)
- 🔲 태그 시스템
- 🔲 PWA (오프라인 지원)

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - 커스텀 스타일 (Bootstrap 5 기반)
- **Vanilla JavaScript (ES6+)** - 프레임워크 없는 순수 JavaScript

### Backend & Database
- **Firebase** (keeply-a2a31)
  - **Firebase Authentication** - 이메일/비밀번호 인증
  - **Firestore** - NoSQL 실시간 데이터베이스 (사용자별 데이터 격리)
  - **Security Rules** - userId 기반 접근 제어

### Hosting & Deployment
- **Cloudflare Pages** - 무료 정적 호스팅
  - 글로벌 CDN 네트워크
  - 자동 HTTPS/SSL
  - 무제한 대역폭

### 개발 도구
- **Live Server** (VS Code 확장) - 로컬 개발 서버
- **Git** - 버전 관리
- **VS Code** - 코드 에디터

## 🎨 디자인

- **레이아웃**: 단일 컬럼, 중앙 정렬 (최대 680px)
- **스타일**: 카드 기반, 모던 미니멀리즘
- **색상 테마**: Burnished Lilac (연한 핑크 그라데이션 배경 + 로즈/틸 포인트)
  - 메인: `#BA797D`, 포인트: `#00666C`, 배경: `linear-gradient(135deg, #F5E9EA 0%, #E6CFD7 100%)`
- **타이포그래피**: Noto Sans KR (한글) + Poppins (영문)
- **모바일 최적화**: iPhone 16 Pro Safe Area 대응, 44px 터치 영역

## 📁 프로젝트 구조

```
keeply/
├── index.html              # 메인 페이지
├── auth.html               # 로그인/회원가입 페이지
├── styles/
│   └── main.css           # 스타일시트
├── scripts/
│   ├── app.js             # 메인 애플리케이션 로직
│   ├── auth.js            # 인증 로직
│   ├── utils.js           # 유틸리티 함수
│   ├── firebase.js        # Firebase 연동
│   ├── firebase-config.js # Firebase 설정 (Git 제외) 🔒
│   └── firebase-config.example.js  # 설정 템플릿
├── assets/
│   └── images/            # 이미지 리소스
├── .env                   # 환경 변수 (Git 제외) 🔒
├── .env.example           # 환경 변수 템플릿
├── .gitignore             # Git 제외 파일 목록
├── CLAUDE.md              # AI 에이전트 가이드
├── TODO.md                # 할 일 목록
└── README.md              # 이 파일
```

## 🚀 시작하기

### 1. 필요 조건
- 웹 브라우저 (Chrome, Safari, Firefox 등)
- VS Code (Live Server 확장 프로그램 포함)
- Git

### 2. Firebase 설정 (필수!)

1. **Firebase Console에서 새 웹 앱 추가**
   - [Firebase Console](https://console.firebase.google.com) 접속
   - Keeply 프로젝트 선택 (또는 새로 생성)
   - 프로젝트 설정 → 앱 추가 → 웹 선택
   - Firebase 설정 정보 복사

2. **설정 파일 생성**
   ```bash
   # 템플릿 복사
   cp scripts/firebase-config.example.js scripts/firebase-config.js

   # firebase-config.js 파일을 열어서 실제 Firebase 설정 값 입력
   ```

3. **Firebase Authentication 활성화**
   - Firebase Console → Authentication → 이메일/비밀번호 활성화

4. **Firestore Database 생성**
   - Firebase Console → Firestore Database → 데이터베이스 만들기
   - 테스트 모드로 시작 (나중에 Security Rules 설정)

### 3. 로컬 실행

```bash
# VS Code에서 프로젝트 열기
code .

# index.html 또는 auth.html 우클릭
# "Open with Live Server" 선택

# 브라우저에서 자동으로 열림
# http://127.0.0.1:5500
```

### 4. 회원가입 및 로그인
- 첫 방문 시 자동으로 로그인 페이지로 이동
- 이메일/비밀번호로 회원가입
- 로그인 후 링크 추가 가능

## 🌐 배포하기

Keeply를 Cloudflare Pages에 무료로 배포할 수 있습니다!

### 빠른 배포 (4단계)

```bash
# 0. Firebase 설정 파일 준비 (최초 1회만)
cp scripts/firebase-config.example.js scripts/firebase-config.js
# → firebase-config.js 파일을 열어서 실제 Firebase 설정 값 입력

# 1. Cloudflare 로그인
npx wrangler login

# 2. 프로젝트 생성
npx wrangler pages project create keeply

# 3. 배포 실행
npm run deploy
```

→ 완료! `https://keeply.pages.dev`로 접속 가능합니다.

**자세한 가이드**:
- **[QUICKSTART.md](QUICKSTART.md)** - 빠른 배포 가이드 (3단계)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 상세 배포 가이드 (문제 해결 포함)

## 📖 문서

- **[QUICKSTART.md](QUICKSTART.md)** - 빠른 배포 가이드 (3단계) 🚀
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 상세 배포 가이드 (문제 해결 포함)
- **[TODO.md](TODO.md)** - 개발 로드맵 및 할 일 목록
- **[CLAUDE.md](CLAUDE.md)** - Claude Code를 위한 프로젝트 가이드

## 🔒 보안 정보

### Firebase 설정 파일 관리

`scripts/firebase-config.js` 파일 관리 방식:
- ❌ **Git 형상 관리 대상이 아님** (`.gitignore`에 포함)
- ✅ **배포 시에는 포함됨** (로컬에 존재하므로 Wrangler가 업로드)
- ✅ **공개되어도 안전함** (Firebase Web API 키는 클라이언트 노출 허용)

### Firebase API 키 보안

Firebase Web API 키는 **공개되어도 안전합니다** (Firebase 공식 입장).
- API 키는 Firebase 프로젝트를 식별하는 용도입니다.
- 실제 데이터 보호는 **Firestore Security Rules**로 이루어집니다.
- 사용자 인증(Authentication)과 Security Rules로 데이터 접근을 제어합니다.

**중요**: Firestore Security Rules를 반드시 설정하세요!
```javascript
// 예시: 사용자별 데이터 격리
match /links/{linkId} {
  allow read, write: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
}
```

자세한 내용은 [DEPLOYMENT.md](./DEPLOYMENT.md#9단계-firebase-보안-설정-매우-중요) 참고

## 🔧 개발 현황

**진행률**: 약 70%
- ✅ Firebase Authentication 완료 (이메일/비밀번호)
- ✅ Firestore 데이터베이스 연동 완료
- ✅ 링크 CRUD 기능 완료 (추가/수정/삭제)
- ✅ UI/UX 디자인 완료 (Burnished Lilac 테마)
- ✅ 검색/필터/즐겨찾기 기능 완료
- ✅ 메모 기능 완료
- ✅ 모바일 최적화 완료 (iPhone 16 Pro)
- 🔄 프로필 시스템 개발 예정
- 🔄 공개/비공개 설정 예정

## 📝 주요 변경 사항

### 2025-10-19
- 🔐 **보안 강화**: Firebase API 키를 별도 파일로 분리, Git 제외
- 🔑 **Firebase Authentication**: 이메일/비밀번호 인증 완료
- 💾 **Firestore 연동**: 사용자별 데이터 격리 완료
- 📝 **링크 CRUD**: 추가/수정/삭제 기능 완성
- 🎨 **UI 개선**: 실시간 URL 메타데이터 자동 채우기

### 2025-10-15
- ✨ **링크 관리**: 추가/수정/삭제 기능 구현
- 🎯 **유효성 검사**: URL 형식 검사, 중복 체크
- 📱 **모바일 최적화**: iPhone 16 Pro Safe Area 대응
- 🎨 **Burnished Lilac 테마**: 전면 리디자인

### 2025-10-04
- 프로젝트 초기 설정 완료
- 기본 MVP 기능 구현
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
