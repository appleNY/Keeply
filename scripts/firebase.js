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
