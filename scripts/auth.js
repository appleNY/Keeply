// 인증 페이지 로직
import { signUp, signIn, initAuth } from './firebase.js';

// DOM 요소
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

/**
 * 탭 전환
 */
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    clearErrors();
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    clearErrors();
});

/**
 * 로그인 폼 제출
 */
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // 유효성 검사
    if (!email || !password) {
        showError(loginError, '이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }

    // 로딩 시작
    setLoading(loginBtn, true);
    clearErrors();

    try {
        const result = await signIn(email, password);

        if (result.success) {
            // 로그인 성공 - 메인 페이지로 이동
            window.location.href = 'index.html';
        } else {
            // 로그인 실패
            showError(loginError, result.error);
            setLoading(loginBtn, false);
        }
    } catch (error) {
        console.error('로그인 에러:', error);
        showError(loginError, '로그인 중 오류가 발생했습니다.');
        setLoading(loginBtn, false);
    }
});

/**
 * 회원가입 폼 제출
 */
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    // 유효성 검사
    if (!name || !email || !password || !passwordConfirm) {
        showError(signupError, '모든 필드를 입력해주세요.');
        return;
    }

    if (name.length < 2) {
        showError(signupError, '이름은 최소 2자 이상이어야 합니다.');
        return;
    }

    if (password.length < 6) {
        showError(signupError, '비밀번호는 최소 6자 이상이어야 합니다.');
        return;
    }

    if (password !== passwordConfirm) {
        showError(signupError, '비밀번호가 일치하지 않습니다.');
        return;
    }

    // 로딩 시작
    setLoading(signupBtn, true);
    clearErrors();

    try {
        const result = await signUp(email, password, name);

        if (result.success) {
            // 회원가입 성공 - 메인 페이지로 이동
            window.location.href = 'index.html';
        } else {
            // 회원가입 실패
            showError(signupError, result.error);
            setLoading(signupBtn, false);
        }
    } catch (error) {
        console.error('회원가입 에러:', error);
        showError(signupError, '회원가입 중 오류가 발생했습니다.');
        setLoading(signupBtn, false);
    }
});

/**
 * 에러 메시지 표시
 */
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

/**
 * 에러 메시지 초기화
 */
function clearErrors() {
    loginError.classList.remove('show');
    signupError.classList.remove('show');
}

/**
 * 로딩 상태 설정
 */
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

/**
 * 페이지 로드 시 인증 상태 확인
 * 이미 로그인되어 있으면 메인 페이지로 리다이렉트
 */
initAuth((user) => {
    if (user) {
        console.log('이미 로그인됨:', user.email);
        window.location.href = 'index.html';
    }
});
