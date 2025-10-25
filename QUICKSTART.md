# 🚀 Cloudflare Pages 빠른 배포 가이드

프로젝트가 모두 준비되어 있습니다! 아래 명령어만 순서대로 실행하세요.

---

## 📝 배포 순서 (4단계)

### 0️⃣ Firebase 설정 파일 준비 (최초 1회만)

**[터미널에서 실행]**
```bash
# 템플릿 복사
cp scripts/firebase-config.example.js scripts/firebase-config.js
```

**[에디터에서 수정]**
- `scripts/firebase-config.js` 파일을 열어서 실제 Firebase 설정 값 입력
- Firebase Console에서 받은 API 키 등을 입력하세요

**중요**:
- ✅ 이 파일은 Git에는 포함되지 않습니다 (`.gitignore`)
- ✅ 하지만 배포 시에는 포함됩니다 (로컬에 존재하므로)

---

### 1️⃣ Cloudflare 로그인

**[터미널에서 실행]**
```bash
npx wrangler login
```

→ 브라우저가 자동으로 열립니다.
→ Cloudflare 계정으로 로그인하고 권한을 승인하세요.
→ 터미널에 "Successfully logged in" 메시지가 나오면 성공!

---

### 2️⃣ Cloudflare Pages 프로젝트 생성

**[터미널에서 실행]**
```bash
npx wrangler pages project create keeply
```

→ 프로젝트 이름: `keeply`
→ Production branch: `main` (기본값 그대로 Enter)
→ `keeply.pages.dev` 도메인이 생성됩니다.

---

### 3️⃣ 배포 실행

**[터미널에서 실행]**
```bash
npm run deploy
```

→ 프로젝트 전체 파일이 업로드됩니다.
→ 약 1~2분 정도 소요됩니다.
→ 완료되면 URL이 표시됩니다!

**예시 출력:**
```
✨ Success! Uploaded 15 files
✨ Deployment complete!

🌎 View your site at:
   https://keeply.pages.dev
```

---

## ✅ 배포 완료!

브라우저에서 제공된 URL로 접속하세요:
```
https://keeply.pages.dev
```

### 테스트 체크리스트
- [ ] 로그인 페이지가 보이나요?
- [ ] 회원가입이 작동하나요?
- [ ] 링크 추가가 되나요?
- [ ] 모바일에서도 잘 보이나요?

---

## 🔄 코드 수정 후 재배포

코드를 수정한 후에는:

```bash
npm run deploy
```

→ 단 한 줄로 재배포 완료!

---

## 🐛 문제가 생겼나요?

상세한 문제 해결 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md) 파일을 참고하세요.

### 자주 발생하는 문제

**Q. `wrangler: command not found` 에러가 나요**
```bash
npm install
```
→ 의존성을 다시 설치하세요.

**Q. 로그인이 안 돼요**
```bash
npx wrangler logout
npx wrangler login
```
→ 로그아웃 후 다시 로그인하세요.

**Q. Firebase 연결이 안 돼요**
→ `scripts/firebase-config.js` 파일이 존재하고 올바른 설정값이 입력되었는지 확인하세요.
→ Firebase Console에서 Security Rules를 확인하세요. ([DEPLOYMENT.md](./DEPLOYMENT.md) 9단계 참고)

---

## 📚 더 알아보기

- **상세 배포 가이드**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **커스텀 도메인 연결**: [DEPLOYMENT.md](./DEPLOYMENT.md#8단계-커스텀-도메인-연결-선택사항)
- **Firebase 보안 설정**: [DEPLOYMENT.md](./DEPLOYMENT.md#9단계-firebase-보안-설정-매우-중요)

---

🎉 **축하합니다!** Keeply가 전 세계에 공개되었습니다!
