# 🚀 Keeply 프로젝트 시작하기

이 문서는 코딩을 처음 시작하는 분들을 위한 단계별 가이드입니다.

---

## 📚 목차
1. [필요한 프로그램 설치](#1-필요한-프로그램-설치)
2. [프로젝트 폴더 구조 만들기](#2-프로젝트-폴더-구조-만들기)
3. [기본 파일 작성하기](#3-기본-파일-작성하기)
4. [Firebase 설정하기](#4-firebase-설정하기)
5. [개발 서버 실행하기](#5-개발-서버-실행하기)
6. [첫 번째 기능 만들기](#6-첫-번째-기능-만들기)

---

## 1. 필요한 프로그램 설치

### 1-1. Node.js 설치 확인

**[터미널에서 실행]**
```bash
node --version
```

**결과:**
- 버전이 나오면 (예: v20.10.0) → ✅ 설치됨
- 에러가 나면 → ❌ 설치 필요

**설치가 필요하다면:**
1. [Node.js 공식 사이트](https://nodejs.org) 접속
2. "LTS" 버전 다운로드 (추천 버전)
3. 설치 후 터미널 재시작

---

### 1-2. VS Code 설치 (선택사항)

**추천 이유:**
- 코드 작성하기 편함
- 터미널 내장
- 자동완성 기능

**설치:**
1. [VS Code 공식 사이트](https://code.visualstudio.com) 접속
2. 다운로드 후 설치
3. 설치 후 실행

---

### 1-3. Git 설치 확인 (선택사항)

**[터미널에서 실행]**
```bash
git --version
```

**용도:**
- 코드 버전 관리 (세이브 포인트)
- 나중에 필요하면 설치해도 됨

---

## 2. 프로젝트 폴더 구조 만들기

### 2-1. keeply 폴더로 이동

**[터미널에서 실행]**
```bash
cd /Users/arawn.park/keeply
```

**설명:**
- `cd` = "change directory" = 폴더 이동
- 이미 keeply 폴더에 있다면 생략 가능

---

### 2-2. 프로젝트 폴더 구조

**우리가 만들 구조:**
```
keeply/
├── index.html          # 메인 페이지 (화면)
├── styles/
│   └── main.css       # 스타일 (디자인)
├── scripts/
│   ├── app.js         # 메인 로직 (동작)
│   ├── firebase.js    # Firebase 연결
│   └── utils.js       # 유틸 함수들
├── assets/
│   └── images/        # 이미지 파일들
└── README.md          # 프로젝트 설명
```

**폴더 만들기 - [터미널에서 실행]**
```bash
mkdir -p styles scripts assets/images
```

**설명:**
- `mkdir` = "make directory" = 폴더 만들기
- `-p` = 중간 폴더도 자동으로 만들기
- 한 번에 여러 폴더 생성

---

## 3. 기본 파일 작성하기

### 3-1. index.html 만들기

**[VS Code에서 생성]**
1. VS Code 열기
2. File > Open Folder > keeply 선택
3. 새 파일 만들기: `index.html`

**내용:**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Keeply - 나의 링크 관리</title>

    <!-- Bootstrap CSS (CDN) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- 우리가 만든 CSS -->
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <!-- 헤더 -->
    <header class="bg-primary text-white p-3">
        <div class="container">
            <h1>🩵 Keeply</h1>
            <p class="mb-0">나의 링크 저장소</p>
        </div>
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="container my-4">
        <!-- 검색 & 필터 -->
        <div class="row mb-3">
            <div class="col-md-8">
                <input type="text" class="form-control" id="searchInput" placeholder="검색...">
            </div>
            <div class="col-md-4">
                <select class="form-select" id="filterSelect">
                    <option value="all">전체</option>
                    <option value="favorite">즐겨찾기</option>
                    <option value="recent">최신순</option>
                </select>
            </div>
        </div>

        <!-- 링크 목록 -->
        <div id="linkList" class="row">
            <!-- 여기에 링크 카드들이 들어갑니다 -->
        </div>

        <!-- 새 링크 추가 버튼 -->
        <button class="btn btn-primary btn-lg w-100 my-4" id="addLinkBtn">
            + 새 링크 추가
        </button>
    </main>

    <!-- Bootstrap JS (CDN) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- 우리가 만든 JavaScript -->
    <script type="module" src="scripts/app.js"></script>
</body>
</html>
```

**주요 부분 설명:**
- `<meta name="viewport">` → 모바일 화면 대응
- `Bootstrap CDN` → 인터넷에서 Bootstrap 가져오기
- `type="module"` → 최신 JavaScript 방식 사용

---

### 3-2. styles/main.css 만들기

**[VS Code에서 생성]**
파일 경로: `styles/main.css`

**내용:**
```css
/* 전체 기본 설정 */
body {
    background-color: #f8f9fa;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 링크 카드 스타일 */
.link-card {
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
    height: 100%;
}

.link-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* 썸네일 이미지 */
.link-thumbnail {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

/* 즐겨찾기 아이콘 */
.favorite-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    cursor: pointer;
    color: #ffc107;
    text-shadow: 0 0 3px rgba(0,0,0,0.5);
}

/* 요약 없음 텍스트 스타일 */
.no-summary {
    color: #6c757d;
    font-style: italic;
}

/* 반응형: 모바일 */
@media (max-width: 768px) {
    .link-thumbnail {
        height: 150px;
    }

    h1 {
        font-size: 1.5rem;
    }
}
```

**설명:**
- `.link-card:hover` → 마우스 올리면 카드가 위로 올라감
- `@media` → 모바일 화면에서는 다른 크기 적용

---

### 3-3. scripts/utils.js 만들기

**[VS Code에서 생성]**
파일 경로: `scripts/utils.js`

**내용:**
```javascript
// 유틸리티 함수들

/**
 * URL에서 도메인 이름 추출
 * 예: https://www.youtube.com/watch?v=123 → youtube.com
 */
export function getDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (error) {
        return '알 수 없음';
    }
}

/**
 * 날짜를 한국어 형식으로 변환
 * 예: 2025-10-04 → 2025.10.04
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

/**
 * 콘텐츠 타입에 따른 기본 요약 문구 반환
 */
export function getDefaultSummary(url) {
    const domain = getDomain(url).toLowerCase();

    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        return '(요약 없음 • 영상 링크)';
    } else if (domain.includes('instagram.com')) {
        return '(요약 없음 • 이미지 게시물)';
    } else if (domain.includes('blog') || domain.includes('tistory') || domain.includes('medium')) {
        return '(요약 없음 • 블로그 글)';
    } else {
        return '(요약 없음 • 일반 링크)';
    }
}

/**
 * URL에서 메타데이터 가져오기 (간단 버전)
 * 실제로는 서버나 API 필요, 여기선 기본값만
 */
export async function fetchMetadata(url) {
    // 나중에 실제 메타데이터 가져오기 구현
    // 지금은 기본값 반환
    return {
        title: url,
        thumbnail: 'https://via.placeholder.com/400x200?text=No+Image',
        description: ''
    };
}
```

**설명:**
- `export` → 다른 파일에서 이 함수들을 사용할 수 있게 함
- `try...catch` → 에러가 나도 프로그램이 멈추지 않게 함

---

### 3-4. scripts/app.js 만들기

**[VS Code에서 생성]**
파일 경로: `scripts/app.js`

**내용:**
```javascript
// 메인 애플리케이션 로직
import { getDomain, formatDate, getDefaultSummary } from './utils.js';

// 임시 데이터 (나중에 Firebase로 대체)
let links = [
    {
        id: 1,
        title: '바닐라 JavaScript 시작하기',
        summary: 'JavaScript 기초부터 실전까지',
        url: 'https://developer.mozilla.org/ko/docs/Web/JavaScript',
        thumbnail: 'https://via.placeholder.com/400x200?text=JavaScript',
        domain: 'developer.mozilla.org',
        saved_date: '2025-10-04',
        is_favorite: false
    },
    {
        id: 2,
        title: 'Bootstrap 공식 문서',
        summary: '',
        url: 'https://getbootstrap.com',
        thumbnail: 'https://via.placeholder.com/400x200?text=Bootstrap',
        domain: 'getbootstrap.com',
        saved_date: '2025-10-03',
        is_favorite: true
    }
];

/**
 * 링크 카드 HTML 생성
 */
function createLinkCard(link) {
    const summary = link.summary || getDefaultSummary(link.url);
    const summaryClass = link.summary ? '' : 'no-summary';
    const favoriteIcon = link.is_favorite ? '⭐' : '☆';

    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card link-card">
                <div class="position-relative">
                    <img src="${link.thumbnail}" class="card-img-top link-thumbnail" alt="${link.title}">
                    <span class="favorite-icon" onclick="toggleFavorite(${link.id})">
                        ${favoriteIcon}
                    </span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${link.title}</h5>
                    <p class="card-text ${summaryClass}">${summary}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">${link.domain}</small>
                        <small class="text-muted">${formatDate(link.saved_date)}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 링크 목록 화면에 표시
 */
function renderLinks(linksToRender = links) {
    const linkList = document.getElementById('linkList');

    if (linksToRender.length === 0) {
        linkList.innerHTML = '<p class="text-center text-muted">저장된 링크가 없습니다.</p>';
        return;
    }

    linkList.innerHTML = linksToRender.map(link => createLinkCard(link)).join('');
}

/**
 * 즐겨찾기 토글
 */
window.toggleFavorite = function(linkId) {
    const link = links.find(l => l.id === linkId);
    if (link) {
        link.is_favorite = !link.is_favorite;
        renderLinks();
        console.log(`링크 ${linkId} 즐겨찾기: ${link.is_favorite}`);
    }
}

/**
 * 검색 기능
 */
function searchLinks(query) {
    const filtered = links.filter(link =>
        link.title.toLowerCase().includes(query.toLowerCase()) ||
        link.summary.toLowerCase().includes(query.toLowerCase()) ||
        link.domain.toLowerCase().includes(query.toLowerCase())
    );
    renderLinks(filtered);
}

/**
 * 필터 기능
 */
function filterLinks(filterType) {
    let filtered = [...links];

    switch(filterType) {
        case 'favorite':
            filtered = links.filter(link => link.is_favorite);
            break;
        case 'recent':
            filtered = links.sort((a, b) => new Date(b.saved_date) - new Date(a.saved_date));
            break;
        default:
            filtered = links;
    }

    renderLinks(filtered);
}

/**
 * 이벤트 리스너 등록
 */
function initEventListeners() {
    // 검색
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchLinks(e.target.value);
    });

    // 필터
    const filterSelect = document.getElementById('filterSelect');
    filterSelect.addEventListener('change', (e) => {
        filterLinks(e.target.value);
    });

    // 새 링크 추가 (임시)
    const addLinkBtn = document.getElementById('addLinkBtn');
    addLinkBtn.addEventListener('click', () => {
        alert('링크 추가 기능은 곧 구현됩니다!');
    });
}

/**
 * 앱 초기화
 */
function init() {
    console.log('Keeply 앱 시작!');
    renderLinks();
    initEventListeners();
}

// 페이지 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', init);
```

**주요 개념 설명:**
- `renderLinks()` → 데이터를 화면에 보여주는 함수
- `addEventListener()` → 사용자 동작(클릭, 입력 등)을 감지
- `DOMContentLoaded` → 페이지가 완전히 로드되면 실행

---

## 4. Firebase 설정하기

### 4-1. Firebase 프로젝트 만들기

1. **[브라우저에서]** [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름: **keeply** 입력
4. Google Analytics: **사용 안 함** (선택사항)
5. **프로젝트 만들기** 클릭

---

### 4-2. Firebase 웹 앱 등록

1. Firebase 콘솔에서 **웹 아이콘(</>)** 클릭
2. 앱 닉네임: **keeply-web** 입력
3. **앱 등록** 클릭
4. **설정 코드 복사** (firebaseConfig 부분)

---

### 4-3. Firestore 데이터베이스 만들기

1. 왼쪽 메뉴에서 **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. 모드: **테스트 모드로 시작** 선택
4. 위치: **asia-northeast3 (서울)** 선택
5. **사용 설정** 클릭

---

### 4-4. scripts/firebase.js 만들기

**[VS Code에서 생성]**
파일 경로: `scripts/firebase.js`

**내용:** (아래 설정 값은 Firebase에서 복사한 것으로 교체)
```javascript
// Firebase 설정 및 초기화

// Firebase SDK 가져오기 (CDN 방식)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase 설정 (Firebase Console에서 복사한 값으로 교체하세요)
const firebaseConfig = {
    apiKey: "여기에-본인의-API-키-입력",
    authDomain: "keeply-xxxxx.firebaseapp.com",
    projectId: "keeply-xxxxx",
    storageBucket: "keeply-xxxxx.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * 모든 링크 가져오기
 */
export async function getLinks() {
    const linksCol = collection(db, 'links');
    const linkSnapshot = await getDocs(linksCol);
    const linkList = linkSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return linkList;
}

/**
 * 새 링크 추가
 */
export async function addLink(linkData) {
    const linksCol = collection(db, 'links');
    const docRef = await addDoc(linksCol, linkData);
    return docRef.id;
}

/**
 * 링크 업데이트
 */
export async function updateLink(linkId, updateData) {
    const linkDoc = doc(db, 'links', linkId);
    await updateDoc(linkDoc, updateData);
}

/**
 * 링크 삭제
 */
export async function deleteLink(linkId) {
    const linkDoc = doc(db, 'links', linkId);
    await deleteDoc(linkDoc);
}

console.log('Firebase 연결 완료!');
```

**⚠️ 중요:**
- `firebaseConfig` 값들을 본인의 Firebase 설정으로 교체해야 합니다!

---

## 5. 개발 서버 실행하기

### 5-1. Live Server 설치 (VS Code 확장)

1. **[VS Code에서]** 왼쪽 확장(Extensions) 아이콘 클릭
2. 검색: **Live Server**
3. **Install** 클릭

---

### 5-2. 서버 실행

1. **[VS Code에서]** `index.html` 파일 열기
2. 하단 상태바에서 **Go Live** 클릭
3. 브라우저가 자동으로 열림 (http://localhost:5500)

**또는 [터미널에서 실행]**
```bash
# 간단한 Python 서버
python3 -m http.server 8000
```
그리고 브라우저에서 `http://localhost:8000` 접속

---

### 5-3. 확인 사항

**[브라우저에서 확인]**
- ✅ Keeply 헤더가 보이는가?
- ✅ 임시 링크 2개가 카드로 보이는가?
- ✅ 검색창에 입력하면 필터링 되는가?
- ✅ 즐겨찾기(⭐) 클릭하면 토글되는가?

**[브라우저 개발자 도구 확인]**
1. `F12` 또는 `Cmd+Option+I` (Mac) 열기
2. Console 탭에서 에러 확인
3. "Keeply 앱 시작!" 메시지 확인

---

## 6. 첫 번째 기능 만들기

### 실습: 링크 클릭 시 새 탭에서 열기

**[scripts/app.js 수정]**

**찾기:** (line 35 부근)
```javascript
<div class="card link-card">
```

**다음으로 변경:**
```javascript
<div class="card link-card" onclick="openLink('${link.url}')">
```

**추가:** (파일 끝에)
```javascript
/**
 * 링크 열기
 */
window.openLink = function(url) {
    window.open(url, '_blank');
}
```

**테스트:**
1. 파일 저장 (Cmd+S / Ctrl+S)
2. 브라우저 새로고침
3. 카드 클릭 → 링크가 새 탭에서 열림

---

## 🎉 축하합니다!

기본 구조가 완성되었습니다!

### 다음 단계
- [ ] Firebase에서 실제 데이터 불러오기
- [ ] 링크 추가 기능 구현
- [ ] 링크 삭제 기능 추가
- [ ] 실제 메타데이터 가져오기 (OG 태그 파싱)

---

## ❓ 자주 발생하는 문제

### 문제 1: 페이지가 안 열려요
**해결:**
- Live Server가 실행 중인지 확인
- 브라우저 캐시 삭제 (Cmd+Shift+R / Ctrl+Shift+R)

### 문제 2: Bootstrap 스타일이 안 먹혀요
**해결:**
- 인터넷 연결 확인 (CDN 사용 중)
- 개발자 도구에서 Network 탭 확인

### 문제 3: JavaScript 에러 발생
**해결:**
- 개발자 도구 Console에서 에러 메시지 확인
- 파일 경로가 정확한지 확인 (`scripts/app.js`)
- 오타가 없는지 확인

### 문제 4: Firebase 연결 안 됨
**해결:**
- `firebaseConfig` 값이 정확한지 확인
- Firebase Console에서 프로젝트 활성화 확인
- 개발자 도구 Console에서 에러 확인

---

## 📞 도움 받기

- **AGENT.md** - AI 에이전트에게 질문하는 방법
- **CLAUDE.md** - 프로젝트 전체 가이드
- **MVP.md** - 기능 명세

막히는 부분이 있으면 언제든 AI에게 물어보세요!
