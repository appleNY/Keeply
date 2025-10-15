# 📜 Keeply 개발 일지

## 2025-10-04 - 프로젝트 시작 및 MVP v1.0 구현

### 🎉 프로젝트 초기 설정

#### 기술 스택 선택
- **고민한 옵션들**:
  - React vs Vue vs Svelte vs 바닐라 JavaScript
  - Bootstrap vs Tailwind CSS
  - Firebase vs Node.js + Express

- **최종 선택**:
  - ✅ **바닐라 JavaScript** - 기초를 확실히 배우기 위해
  - ✅ **Bootstrap 5** - 빠른 시작과 모바일 대응
  - ✅ **Firebase** - 서버 관리 불필요, 빠른 배포

#### 문서 작성
- `CLAUDE.md` - AI 에이전트를 위한 프로젝트 가이드
- `AGENT.md` - 초보자를 위한 AI 활용 가이드
- `GETTING_STARTED.md` - 상세한 개발 시작 가이드
- `MVP.md` - 1차 기능 명세

---

### 🏗️ 프로젝트 구조 생성

```
keeply/
├── index.html
├── styles/
│   └── main.css
├── scripts/
│   ├── app.js
│   ├── utils.js
│   └── firebase.js
└── assets/
    └── images/
```

**생성된 파일들**:
- `index.html` - Bootstrap 기반 메인 페이지
- `styles/main.css` - 커스텀 스타일
- `scripts/utils.js` - 도메인 추출, 날짜 포맷 등 유틸리티
- `scripts/app.js` - 검색, 필터, 렌더링 로직
- `scripts/firebase.js` - Firebase 연동 준비 (설정값 추후 입력)

---

### ✨ 기본 기능 구현 (오전)

#### 구현된 기능
1. **링크 목록 표시**
   - 임시 데이터 2개로 테스트
   - 카드 그리드 레이아웃 (Bootstrap 그리드 사용)
   - 썸네일, 제목, 요약, 출처, 날짜 표시

2. **검색 기능**
   ```javascript
   // 제목, 요약, 도메인에서 검색
   filter(link =>
     link.title.includes(query) ||
     link.summary.includes(query) ||
     link.domain.includes(query)
   )
   ```

3. **필터 기능**
   - 전체 보기
   - 즐겨찾기만 보기
   - 최신순 정렬

4. **즐겨찾기 토글**
   - 별 아이콘 클릭으로 토글
   - ⭐ (활성) ↔️ ☆ (비활성)

5. **요약 없음 처리**
   - MVP 규칙대로 콘텐츠 타입별 기본 문구
   - 유튜브: "(요약 없음 • 영상 링크)"
   - 인스타그램: "(요약 없음 • 이미지 게시물)"
   - 블로그: "(요약 없음 • 블로그 글)"
   - 기타: "(요약 없음 • 일반 링크)"

---

### 🎨 UI/UX 대대적 개편 (오후)

#### Linktree 스타일 분석
- 참고 URL: https://linktr.ee/2020wonderwoman
- WebFetch로 디자인 분석
  - 단일 컬럼 세로 레이아웃
  - 프로필 영역 (이미지 + 이름 + 소개)
  - 버튼 형태의 링크
  - 깔끔하고 미니멀한 디자인

#### 레이아웃 변경
**변경 전**:
- Bootstrap 그리드 (col-md-6, col-lg-4)
- 카드 형태 (card, card-body)
- 3컬럼 레이아웃

**변경 후**:
- 단일 컬럼 중앙 정렬 (max-width: 680px)
- 버튼 형태 링크 (link-button)
- 프로필 영역 추가
- 세로 스크롤

#### 구조 변경
```html
<!-- 변경 전 -->
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <div class="card">...</div>
    </div>
  </div>
</div>

<!-- 변경 후 -->
<div class="main-wrapper">
  <header class="profile-section">...</header>
  <main class="links-container">
    <div class="link-list">
      <div class="link-button">...</div>
    </div>
  </main>
</div>
```

#### 색상 테마 변경 이력

1. **초기 색상** (Bootstrap 기본)
   - 배경: #f8f9fa (연한 회색)
   - 버튼: Bootstrap Primary 파란색

2. **Linktree 스타일 적용**
   - 배경: 파스텔 블루 그라데이션 (#D1F6FF → #E8F5FF)
   - 버튼: 보라색 테두리 (#7B68EE)
   - 텍스트: 진한 남색 (#083170)

3. **사용자 요청으로 녹색 테마**
   - 배경: #619459 (녹색)
   - 임시 적용

4. **최종 색상** (현재)
   - 배경: #f5e9e9 (따뜻한 베이지 핑크)
   - 주요 텍스트: #8b4f4f (브라운)
   - 테두리: #d4a5a5 (로즈 핑크)
   - 호버: #c17a7a (진한 로즈)
   - 메타 정보: #c17a7a
   - 버튼: #d4a5a5 → #c17a7a (호버)

#### CSS 주요 변경 사항

**새로운 클래스들**:
```css
.main-wrapper          /* 중앙 정렬 컨테이너 */
.profile-section       /* 프로필 영역 */
.profile-image         /* 프로필 이미지 */
.profile-name          /* 이름 */
.profile-bio           /* 소개 */
.links-container       /* 링크 영역 */
.controls-section      /* 검색/필터 영역 */
.link-list             /* 링크 목록 */
.link-button           /* 링크 버튼 */
.link-button-content   /* 버튼 내부 레이아웃 */
.link-thumbnail-small  /* 작은 썸네일 (60x60) */
.link-info             /* 링크 정보 */
.link-title            /* 링크 제목 */
.link-description      /* 링크 설명 */
.link-meta             /* 메타 정보 */
```

**애니메이션 효과**:
- `transform: scale(1.02)` - 호버 시 살짝 확대
- `box-shadow: 0 8px 20px` - 호버 시 그림자 효과
- `transition: all 0.3s ease` - 부드러운 전환

---

### 🔧 기타 개선사항

1. **좌우 여백 조정**
   - 컨테이너에 padding 24px 추가
   - 더 넓은 여백으로 가독성 향상

2. **프로필 영역**
   - 파란색 하트 이모지(🩵) 제거
   - "Keeply" 텍스트만 표시

3. **반응형 디자인**
   ```css
   @media (max-width: 768px) {
     .controls-section { flex-direction: column; }
     .link-thumbnail-small { width: 50px; height: 50px; }
   }
   ```

---

### 📊 개발 환경

**로컬 서버**:
```bash
python3 -m http.server 8000
# http://localhost:8000
```

**브라우저 테스트**:
- Chrome (주 테스트)
- Safari (모바일 테스트)
- Firefox (크로스 브라우징)

---

### 📝 작성된 문서들

1. **README.md** - 프로젝트 전체 소개
2. **TODO.md** - 할 일 목록 (업데이트됨)
3. **CHANGELOG.md** - 이 파일
4. **CLAUDE.md** - AI 에이전트 가이드
5. **AGENT.md** - AI 사용법
6. **GETTING_STARTED.md** - 개발 시작 가이드
7. **MVP.md** - 기능 명세

---

### ✅ 완료된 작업 요약

- [x] 프로젝트 초기 설정
- [x] 기술 스택 선택 및 가이드 작성
- [x] 폴더 구조 생성
- [x] HTML/CSS/JS 기본 파일 작성
- [x] 검색/필터/즐겨찾기 기능 구현
- [x] Linktree 스타일 UI 재디자인
- [x] 색상 테마 변경 (#f5e9e9)
- [x] 반응형 디자인 적용
- [x] 문서화 완료

---

### 🚀 다음 단계

1. **Firebase 연동**
   - Firebase 프로젝트 생성
   - Firestore 설정
   - 실제 데이터 CRUD 구현

2. **링크 추가 기능**
   - 모달 UI 제작
   - URL 입력 폼
   - 메타데이터 자동 추출

3. **링크 관리**
   - 수정 기능
   - 삭제 기능
   - 드래그 앤 드롭 정렬

---

### 📈 통계

**개발 시간**: 약 6-8시간
**파일 수**: 12개
**코드 라인 수**: 약 500줄
**커밋 수**: 0 (Git 초기화 예정)

---

### 🎓 배운 것들

1. **바닐라 JavaScript**
   - DOM 조작 (getElementById, addEventListener)
   - 배열 메서드 (map, filter, find, sort)
   - ES6 모듈 (import/export)
   - 이벤트 처리 (click, input, change)

2. **CSS**
   - Flexbox 레이아웃
   - 반응형 디자인 (@media)
   - 애니메이션 (transform, transition)
   - 색상 조합 및 테마 디자인

3. **프로젝트 관리**
   - 문서화의 중요성
   - TODO 리스트 활용
   - 버전 관리 준비

4. **UI/UX 디자인**
   - Linktree 스타일 분석
   - 색상 조화
   - 사용자 경험 고려

---

**작성일**: 2025-10-04
**작성자**: JiYoung (with Claude Code)

---

## 2025-10-15 - 링크 추가/수정/삭제 기능 완료 🎉

### ✨ 주요 기능 구현

#### 1. 링크 추가 모달 UI
- **구현 위치**: `index.html:105-138`, `styles/main.css`
- **기능**:
  - URL, 제목, 설명 입력 필드
  - Burnished Lilac 테마 적용
  - 블러 배경 효과
  - 부드러운 열기/닫기 애니메이션
- **사용자 경험**:
  - 모달 외부 클릭으로 닫기
  - ESC 키로 닫기 지원
  - 저장/취소 버튼 제공

#### 2. 메타데이터 자동 추출 🔍
- **구현 위치**: `scripts/utils.js`
- **주요 기술**:
  ```javascript
  // 3단계 Fallback 시스템
  1. Instagram oEmbed API (인스타그램 전용)
     → https://api.instagram.com/oembed/

  2. LinkPreview API (일반 링크)
     → https://api.linkpreview.net/
     → 무료 60 requests/day

  3. AllOrigins (최종 대체)
     → https://api.allorigins.win/
     → CORS 우회용 프록시
  ```

- **추출 정보**:
  - Open Graph 제목 (`og:title`)
  - Open Graph 설명 (`og:description`)
  - Open Graph 이미지 (`og:image`)
  - Meta 태그 정보
  - 본문 텍스트 (OG 없을 때)

- **특별 처리**:
  - 인스타그램: 공식 oEmbed API 사용
  - 페이스북: LinkPreview API로 처리
  - 유튜브: 썸네일 자동 추출

#### 3. 텍스트 길이 제한 ✂️
- **구현 함수**: `truncateTitle()`, `truncateDescription()`
- **규칙**:
  - 제목: 최대 50자 + "..."
  - 설명: 최대 100자 + "..."
- **적용 위치**:
  - 메타데이터 추출 시 자동 적용
  - 링크 카드 표시 시 적용

#### 4. 메모 기능 📝
- **구현 위치**: `scripts/app.js:700-750`
- **기능**:
  - 링크별 개인 메모 추가/수정
  - 메모 모달 UI (textarea)
  - 메모 아이콘 (📝) 클릭으로 열기
- **UI**:
  - 메모가 있으면 카드에 표시
  - 특별한 스타일 (베이지 배경)
  - 호버 시에만 메모 버튼 표시

#### 5. LocalStorage 데이터 저장 💾
- **구현 위치**: `scripts/app.js:4-67`
- **스토리지 키**: `keeply_links`
- **기능**:
  ```javascript
  // 자동 저장 시점
  1. 링크 추가 시
  2. 링크 수정 시
  3. 링크 삭제 시
  4. 즐겨찾기 토글 시
  5. 메모 저장 시
  ```

- **초기 데이터**:
  - LocalStorage 비어있으면 샘플 3개 표시
  - Mozilla MDN, Bootstrap, Keeply GitHub

#### 6. 링크 수정 기능 ✏️
- **구현 위치**: `scripts/app.js:489-530`
- **기능**:
  - 수정 버튼 (✏️) 클릭
  - 기존 데이터 자동 채우기
  - URL 필드 비활성화 (수정 불가)
  - 제목/설명만 수정 가능
- **상태 관리**:
  ```javascript
  let currentEditingLinkId = null;
  // null: 추가 모드
  // 숫자: 수정 모드 (링크 ID)
  ```

#### 7. 링크 삭제 기능 🗑️
- **구현 위치**: `scripts/app.js:596-650`
- **기능**:
  - 웹: 삭제 버튼 (🗑️) 클릭
  - 모바일: 왼쪽 스와이프 (기존 기능)
  - 삭제 확인 모달 (이중 확인)
- **UI**:
  - 블러 배경
  - "정말 삭제하시겠습니까?" 메시지
  - 취소/삭제 버튼

#### 8. 버튼 레이아웃 개선 🎨
- **구현 위치**: `styles/main.css:480-580`
- **레이아웃**: 세로 배치 (오른쪽 정렬)
  ```
  ⭐ 즐겨찾기 (항상 표시)
  ✏️ 수정       (호버 시)
  📝 메모       (호버 시)
  🗑️ 삭제      (호버 시)
  ```

- **위치**:
  - 즐겨찾기: `top: 8px`
  - 수정: `top: 52px`
  - 메모: `top: 96px`
  - 삭제: `top: 140px`
  - 모두 `right: 8px`

- **애니메이션**:
  - 호버 시 `opacity: 0 → 1`
  - 호버 시 `translateX(5px) → 0`
  - `transition: all 0.2s ease`

#### 9. URL 유효성 검사 ✅
- **구현 위치**: `scripts/app.js:547-569`
- **검사 항목**:
  1. **URL 형식 검사**:
     ```javascript
     try {
       new URL(url); // 올바른 URL 형식인지 확인
     } catch {
       // 에러 메시지 표시
     }
     ```

  2. **중복 URL 검사** (추가 모드에서만):
     ```javascript
     const isDuplicate = links.some(link => link.url === url);
     if (isDuplicate) {
       // "이미 저장된 링크입니다" 에러
     }
     ```

- **에러 메시지**:
  - 형식 오류: "올바른 URL 형식이 아닙니다. https:// 또는 http://로 시작하는 주소를 입력해주세요."
  - 중복: "이미 저장된 링크입니다. 다른 URL을 입력해주세요."

#### 10. 네트워크 에러 처리 🌐
- **구현 위치**: `scripts/app.js:466-486`
- **에러 종류별 메시지**:
  ```javascript
  // 타임아웃
  if (error.name === 'AbortError') {
    "요청 시간이 초과되었습니다. 제목과 설명을 직접 입력해주세요."
  }

  // 인터넷 연결 끊김
  else if (!navigator.onLine) {
    "인터넷 연결을 확인해주세요."
  }

  // 기타 에러
  else {
    "링크 정보를 자동으로 가져올 수 없습니다. 제목과 설명을 직접 입력해주세요."
  }
  ```

- **UI 표시**:
  - 빨간색 에러 메시지 (`#8C3F5C`)
  - URL 입력 필드 아래 표시
  - 모달 열 때 자동 초기화

---

### 🔧 수정된 파일들

#### HTML
- `index.html`
  - 링크 추가/수정 모달 추가 (105-138줄)
  - 메모 모달 추가
  - 에러 메시지 표시 요소 추가

#### CSS
- `styles/main.css`
  - 모달 스타일 추가
  - 버튼 세로 배치 스타일
  - 메모 영역 스타일
  - 에러 메시지 스타일
  - 호버 애니메이션 개선

#### JavaScript
- `scripts/app.js`
  - LocalStorage 저장/불러오기 함수
  - 링크 추가/수정 처리 함수
  - 메모 기능 구현
  - 유효성 검사 함수
  - 에러 처리 개선
  - 모달 이벤트 핸들러

- `scripts/utils.js`
  - `fetchMetadata()` - 3단계 fallback
  - `fetchInstagramMetadata()` - 인스타그램 전용
  - `fetchWithLinkPreview()` - LinkPreview API
  - `truncateTitle()` - 제목 길이 제한
  - `truncateDescription()` - 설명 길이 제한

---

### 📊 코드 통계

**변경된 파일**: 4개
- `index.html`: +35줄
- `styles/main.css`: +200줄
- `scripts/app.js`: +300줄
- `scripts/utils.js`: +150줄

**총 추가 코드**: 약 685줄

---

### 🎓 배운 것들

#### 1. API 통합
- CORS 우회 방법 (AllOrigins)
- API fallback 패턴 구현
- 타임아웃 처리 (`AbortController`)
- 에러 핸들링 best practices

#### 2. 상태 관리
- 모달 열기/닫기 상태
- 수정/추가 모드 구분
- 메타데이터 임시 저장
- LocalStorage 동기화

#### 3. 사용자 경험
- 자동 메타데이터 추출로 입력 최소화
- 중복 체크로 데이터 정합성 유지
- 친절한 에러 메시지
- 호버 시에만 버튼 표시로 깔끔한 UI

#### 4. 비동기 처리
```javascript
// async/await 패턴
async function fetchMetadata(url) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return processData(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

---

### 🐛 해결한 문제들

#### 1. 소셜 미디어 메타데이터 추출 실패
- **문제**: 인스타그램/페이스북 링크에서 메타데이터 추출 안 됨
- **원인**: CORS 정책, 동적 렌더링 콘텐츠
- **해결**:
  - Instagram oEmbed API 사용
  - LinkPreview API 연동
  - 3단계 fallback 시스템

#### 2. 텍스트 길이 너무 긴 문제
- **문제**: 제목/설명이 너무 길어서 UI 깨짐
- **해결**:
  - 제목 50자, 설명 100자 제한
  - `truncateTitle()`, `truncateDescription()` 함수 구현

#### 3. 버튼 정렬 문제
- **문제**: 즐겨찾기와 메모 버튼 위치 불일치
- **해결**:
  - 모든 버튼 `right: 8px`로 통일
  - 세로 배치 (`top` 값만 변경)

#### 4. 중복 링크 저장
- **문제**: 같은 URL 여러 번 저장 가능
- **해결**:
  - `validateUrl()` 함수에서 중복 체크
  - `links.some(link => link.url === url)`

---

### ✅ 완료된 작업 요약

- [x] 링크 추가 모달 UI 디자인
- [x] 메타데이터 자동 추출 (OG 태그)
- [x] 소셜 미디어 링크 지원 (Instagram, Facebook)
- [x] 텍스트 길이 제한 (제목 50자, 설명 100자)
- [x] 메모 기능 구현
- [x] LocalStorage 데이터 저장
- [x] 링크 수정 기능
- [x] 링크 삭제 기능 (웹 + 모바일)
- [x] 버튼 레이아웃 개선 (세로 배치)
- [x] URL 유효성 검사 (형식, 중복)
- [x] 네트워크 에러 처리

---

### 🚀 다음 단계

#### 우선순위 1: Firebase 연동
- Firebase 프로젝트 생성
- Firestore 데이터베이스 설정
- LocalStorage → Firebase 마이그레이션
- 실시간 동기화

#### 우선순위 2: 태그 시스템
- 태그 데이터 구조 설계
- 태그 UI 구현
- 태그 필터링 기능
- 태그 관리 기능

#### 우선순위 3: 고급 기능
- 무한 스크롤
- 드래그 앤 드롭 정렬
- 다크 모드
- PWA 최적화

---

### 📈 프로젝트 진행 상황

**시작일**: 2025-10-04
**현재 날짜**: 2025-10-15
**경과 일수**: 11일
**완료율**: 약 75%

**완료된 기능**:
- ✅ 기본 UI/UX (100%)
- ✅ 검색/필터 (100%)
- ✅ 링크 추가/수정/삭제 (100%)
- ✅ 메모 기능 (100%)
- ✅ LocalStorage 저장 (100%)
- ⏳ Firebase 연동 (0%)
- ⏳ 태그 시스템 (0%)

---

**작성일**: 2025-10-15
**작성자**: JiYoung (with Claude Code)
