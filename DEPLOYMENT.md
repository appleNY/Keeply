# Cloudflare Pages 배포 가이드

Keeply 웹앱을 Cloudflare Pages에 배포하는 방법을 단계별로 안내합니다.

---

## 📋 사전 준비사항

- ✅ [Cloudflare 계정](https://dash.cloudflare.com/sign-up) (무료)
- ✅ Node.js 설치 (v16 이상 권장)
- ✅ Git 설치
- ✅ 터미널(맥/리눅스) 또는 명령 프롬프트(윈도우) 사용 가능

---

## 🚀 1단계: Wrangler CLI 설치

**Wrangler**는 Cloudflare의 공식 CLI 도구입니다.

### [터미널에서 실행]

```bash
npm install -g wrangler
```

→ 이 명령어는 Wrangler를 전역(global)으로 설치합니다.
→ 설치가 완료되면 어느 폴더에서든 `wrangler` 명령어를 사용할 수 있습니다.

### 설치 확인

```bash
wrangler --version
```

→ 버전 번호가 표시되면 성공! (예: `3.78.0`)

---

## 🔐 2단계: Cloudflare 로그인

### [터미널에서 실행]

```bash
wrangler login
```

→ 브라우저가 자동으로 열립니다.
→ Cloudflare 계정으로 로그인하고 권한을 승인하세요.
→ 터미널에 "Successfully logged in" 메시지가 표시되면 성공!

---

## 📦 3단계: 프로젝트 의존성 설치

프로젝트 폴더(keeply)로 이동한 후:

### [터미널에서 실행]

```bash
npm install
```

→ `package.json`에 명시된 `wrangler`가 개발 의존성으로 설치됩니다.
→ `node_modules` 폴더가 생성됩니다.

---

## 📋 3-1단계: Firebase 설정 파일 준비 (중요!)

배포하기 전에 `scripts/firebase-config.js` 파일이 로컬에 존재해야 합니다.

### [터미널에서 실행]

```bash
# 템플릿 파일 복사
cp scripts/firebase-config.example.js scripts/firebase-config.js
```

### [에디터에서 수정]

`scripts/firebase-config.js` 파일을 열어서 **실제 Firebase 설정 값을 입력**하세요.
(Firebase Console에서 받은 API 키 등)

**중요 사항**:
- ✅ 이 파일은 **Git 형상 관리 대상이 아닙니다** (`.gitignore`에 포함)
- ✅ 하지만 **배포 시에는 포함됩니다** (로컬에 존재하므로)
- ✅ Firebase Web API 키는 공개되어도 안전합니다 (Firebase 공식 입장)
- ✅ 실제 보안은 Firestore Security Rules로 보호됩니다

---

## 🌐 4단계: Cloudflare Pages 프로젝트 생성

### 4-1. 프로젝트 생성

### [터미널에서 실행]

```bash
wrangler pages project create keeply
```

→ 프로젝트 이름: `keeply`
→ 자동으로 `<프로젝트명>.pages.dev` 서브도메인이 생성됩니다.
→ 예: `keeply.pages.dev`

### 4-2. 프로덕션 브랜치 설정

프롬프트가 나타나면:

```
? What is your production branch name?
> main
```

→ `main` 입력 (또는 기본값 그대로 Enter)

---

## 🚀 5단계: 첫 배포 실행

프로젝트가 생성되었으니 이제 실제 파일들을 배포합니다.

### [터미널에서 실행]

```bash
npm run deploy
```

**또는**

```bash
wrangler pages deploy . --project-name=keeply
```

→ `.` (현재 디렉토리) 전체를 `keeply` 프로젝트로 배포합니다.
→ HTML, CSS, JavaScript, 이미지 등 모든 파일이 업로드됩니다.

### 배포 과정 설명

```
Uploading...
✨ Success! Uploaded 15 files
✨ Compiled Worker successfully
✨ Uploading Worker bundle
✨ Deployment complete!

🌎 View your site at:
   https://keeply.pages.dev
```

→ 약 1~2분 정도 소요됩니다.
→ 완료되면 URL이 표시됩니다!

---

## ✅ 6단계: 배포 확인

### [브라우저에서 확인]

배포가 완료되면 제공된 URL로 접속하세요:

```
https://keeply.pages.dev
```

→ 웹앱이 정상적으로 보이나요? 축하합니다! 🎉

### 테스트 체크리스트

- [ ] 로그인 페이지가 정상적으로 표시되는가?
- [ ] 회원가입이 정상적으로 작동하는가?
- [ ] Firebase Authentication 연동이 정상인가?
- [ ] 링크 추가/수정/삭제가 정상적으로 작동하는가?
- [ ] 모바일에서도 잘 보이는가? (반응형 확인)

---

## 🔄 7단계: 업데이트 배포

코드를 수정한 후 다시 배포하는 방법:

### [터미널에서 실행]

```bash
npm run deploy
```

→ 매번 새로운 버전이 자동으로 배포됩니다.
→ Cloudflare Pages는 자동으로 이전 버전을 보관하여 롤백이 가능합니다.

---

## 🌍 8단계: 커스텀 도메인 연결 (선택사항)

자신만의 도메인(예: `keeply.com`)을 연결하고 싶다면:

### 8-1. Cloudflare 대시보드 접속

1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. **Workers & Pages** 메뉴 클릭
3. `keeply` 프로젝트 선택
4. **Custom domains** 탭 클릭

### 8-2. 도메인 추가

1. **Set up a custom domain** 버튼 클릭
2. 소유한 도메인 입력 (예: `keeply.com` 또는 `app.keeply.com`)
3. DNS 레코드 자동 설정 확인
4. 완료!

→ SSL 인증서가 자동으로 발급됩니다. (무료, Let's Encrypt)
→ 약 10분~1시간 정도면 HTTPS로 접속 가능합니다.

---

## 🔒 9단계: Firebase 보안 설정 (매우 중요!)

### Firebase Security Rules 설정

Firestore Database의 보안 규칙을 반드시 확인하세요.

### [Firebase Console에서 설정]

1. [Firebase Console](https://console.firebase.google.com) 접속
2. `keeply-a2a31` 프로젝트 선택
3. **Firestore Database** → **규칙(Rules)** 탭 클릭

### 권장 보안 규칙 (사용자별 데이터 격리)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 링크 컬렉션: 본인이 생성한 링크만 읽기/쓰기 가능
    match /links/{linkId} {
      allow read, write: if request.auth != null
                        && request.resource.data.userId == request.auth.uid;
    }

    // 사용자 프로필: 본인 프로필만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null
                        && request.auth.uid == userId;
    }
  }
}
```

→ 이 규칙은 **로그인한 사용자**만 자신의 데이터에 접근할 수 있도록 보호합니다.
→ API 키가 공개되어 있어도 데이터는 안전합니다!

### Firebase App Check 활성화 (추가 보안)

1. Firebase Console → **App Check** 메뉴
2. **시작하기** 클릭
3. reCAPTCHA Enterprise 또는 reCAPTCHA v3 등록
4. 웹 앱에 App Check SDK 추가

---

## 📊 10단계: Cloudflare 대시보드에서 관리

### 배포 이력 확인

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
2. `keeply` 프로젝트 클릭
3. **Deployments** 탭에서 모든 배포 이력 확인 가능

### 롤백하기

이전 버전으로 돌아가고 싶다면:

1. **Deployments** 탭에서 원하는 버전 선택
2. **Rollback to this deployment** 버튼 클릭
3. 즉시 이전 버전으로 복원됩니다!

### 환경 변수 설정 (필요 시)

1. 프로젝트 **Settings** 탭 클릭
2. **Environment variables** 섹션
3. 변수 추가/수정 가능

→ 하지만 현재 프로젝트는 Firebase 설정이 클라이언트 코드에 포함되어 있어 환경변수가 필요 없습니다.

---

## 🐛 문제 해결 (Troubleshooting)

### 문제 1: `wrangler: command not found`

**원인**: Wrangler가 설치되지 않았거나 PATH 설정이 안 됨.

**해결**:
```bash
npm install -g wrangler
```

### 문제 2: 배포 후 Firebase 연결 안 됨

**원인**: Firebase 설정 파일이 배포되지 않았거나 Security Rules 문제.

**해결**:
1. `scripts/firebase-config.js` 파일이 존재하는지 확인
2. Firebase Console에서 Security Rules 확인
3. 브라우저 개발자 도구(F12) → Console 탭에서 에러 메시지 확인

### 문제 3: 로그인 후 화면이 하얗게 나옴

**원인**: JavaScript 모듈 경로 문제 또는 CORS 에러.

**해결**:
1. 브라우저 F12 → Console 탭에서 에러 확인
2. `index.html`의 `<script type="module">` 경로 확인
3. Firebase CDN 로딩 확인

### 문제 4: 이미지가 안 보임

**원인**: 이미지 경로가 상대경로로 되어 있어 Cloudflare Pages에서 못 찾음.

**해결**:
```html
<!-- 잘못된 경로 -->
<img src="../assets/images/profile.png">

<!-- 올바른 경로 (루트 기준) -->
<img src="/assets/images/profile.png">
```

---

## 📚 참고 자료

- [Cloudflare Pages 공식 문서](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)
- [Firebase Security Rules 가이드](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase API 키 보안](https://firebase.google.com/docs/projects/api-keys)

---

## 💡 추가 팁

### Git과 연동하기

Cloudflare Pages는 GitHub/GitLab과 자동 연동이 가능합니다.

1. GitHub에 프로젝트 푸시
2. Cloudflare Dashboard → **Create a project**
3. **Connect to Git** 선택
4. GitHub 저장소 연결
5. 자동 배포 설정 완료!

→ 이후 `git push`만 하면 자동으로 배포됩니다! (CI/CD)

### 프리뷰 배포

개발 중인 기능을 테스트하고 싶다면:

```bash
wrangler pages deploy . --project-name=keeply --branch=dev
```

→ 별도의 프리뷰 URL이 생성됩니다 (예: `dev.keeply.pages.dev`)

---

## 🎉 축하합니다!

Keeply 웹앱이 전 세계에 배포되었습니다!
Cloudflare의 글로벌 CDN 네트워크를 통해 빠른 속도로 서비스됩니다.

**무료 플랜 제공 사항**:
- ✅ 무제한 대역폭
- ✅ 무제한 요청
- ✅ 무료 SSL 인증서
- ✅ 자동 HTTPS
- ✅ Git 연동 자동 배포

궁금한 점이 있으면 언제든지 물어보세요! 😊
