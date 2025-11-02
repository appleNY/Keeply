// Firebase 설정 및 초기화

// Firebase SDK 가져오기 (CDN 방식)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    setDoc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase 설정 가져오기 (별도 파일에서 import)
import { firebaseConfig } from './firebase-config.js';

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// 현재 로그인한 사용자
export let currentUser = null;

/**
 * 현재 로그인한 사용자 가져오기
 */
export function getCurrentUser() {
    return auth.currentUser;
}

/**
 * 인증 상태 변경 리스너 설정
 * 페이지 로드 시 자동으로 로그인 상태 확인
 */
export function initAuth(callback) {
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (callback) {
            callback(user);
        }
    });
}

/**
 * 회원가입
 */
export async function signUp(email, password, displayName) {
    try {
        // 1. Firebase Auth에 사용자 생성
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. 사용자 프로필 업데이트 (displayName)
        await updateProfile(user, {
            displayName: displayName
        });

        // 3. Firestore에 사용자 정보 저장
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            displayName: displayName,
            bio: '나의 링크 저장소',
            profileImage: '',
            isPublic: false,
            createdAt: new Date().toISOString()
        });

        currentUser = user;
        return { success: true, user };
    } catch (error) {
        console.error('회원가입 실패:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * 로그인
 */
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        currentUser = userCredential.user;
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('로그인 실패:', error);
        return { success: false, error: getErrorMessage(error.code) };
    }
}

/**
 * 로그아웃
 */
export async function logOut() {
    try {
        await signOut(auth);
        currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('로그아웃 실패:', error);
        return { success: false, error: '로그아웃에 실패했습니다.' };
    }
}

/**
 * 사용자 정보 가져오기
 */
export async function getUserProfile(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return { success: true, data: userDoc.data() };
        } else {
            return { success: false, error: '사용자 정보를 찾을 수 없습니다.' };
        }
    } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        return { success: false, error: '사용자 정보를 불러올 수 없습니다.' };
    }
}

/**
 * 현재 사용자의 모든 링크 가져오기
 */
export async function getLinks(userId) {
    if (!userId) {
        console.error('userId가 필요합니다.');
        return [];
    }

    try {
        const q = query(collection(db, 'links'), where('userId', '==', userId));
        const linkSnapshot = await getDocs(q);
        const linkList = linkSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return linkList;
    } catch (error) {
        console.error('링크 가져오기 실패:', error);
        return [];
    }
}

/**
 * 새 링크 추가
 */
export async function addLink(linkData, userId) {
    if (!userId) {
        throw new Error('userId가 필요합니다.');
    }

    try {
        const linksCol = collection(db, 'links');
        const docRef = await addDoc(linksCol, {
            ...linkData,
            userId: userId,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error('링크 추가 실패:', error);
        throw error;
    }
}

/**
 * 링크 업데이트
 */
export async function updateLink(linkId, updateData) {
    try {
        const linkDoc = doc(db, 'links', linkId);
        await updateDoc(linkDoc, updateData);
    } catch (error) {
        console.error('링크 업데이트 실패:', error);
        throw error;
    }
}

/**
 * 링크 삭제
 */
export async function deleteLink(linkId) {
    try {
        const linkDoc = doc(db, 'links', linkId);
        await deleteDoc(linkDoc);
    } catch (error) {
        console.error('링크 삭제 실패:', error);
        throw error;
    }
}

/**
 * 이미지 파일을 Firebase Storage에 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} userId - 사용자 ID
 * @returns {Promise<string>} - 업로드된 이미지의 다운로드 URL
 */
export async function uploadImage(file, userId) {
    try {
        // 파일 크기 체크 (5MB 제한)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('파일 크기는 5MB 이하여야 합니다.');
        }

        // 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            throw new Error('이미지 파일만 업로드 가능합니다.');
        }

        // 고유한 파일명 생성 (사용자ID/타임스탬프_원본파일명)
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name}`;
        const storagePath = `images/${userId}/${fileName}`;

        // Storage 참조 생성
        const storageRef = ref(storage, storagePath);

        // 파일 업로드
        const snapshot = await uploadBytes(storageRef, file);

        // 다운로드 URL 가져오기
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw error;
    }
}

/**
 * Firebase Storage에서 이미지 삭제
 * @param {string} imageUrl - 삭제할 이미지 URL
 */
export async function deleteImage(imageUrl) {
    try {
        // URL에서 Storage 경로 추출
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error) {
        console.error('이미지 삭제 실패:', error);
        // 이미지 삭제 실패는 치명적이지 않으므로 에러를 throw하지 않음
    }
}

/**
 * Firebase Auth 에러 메시지 변환
 */
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
        'auth/invalid-email': '유효하지 않은 이메일 주소입니다.',
        'auth/operation-not-allowed': '이메일/비밀번호 로그인이 비활성화되어 있습니다.',
        'auth/weak-password': '비밀번호는 최소 6자 이상이어야 합니다.',
        'auth/user-disabled': '비활성화된 계정입니다.',
        'auth/user-not-found': '등록되지 않은 이메일입니다.',
        'auth/wrong-password': '잘못된 비밀번호입니다.',
        'auth/too-many-requests': '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
        'auth/network-request-failed': '네트워크 연결을 확인해주세요.'
    };

    return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
}

console.log('Firebase 연결 완료!');
