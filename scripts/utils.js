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

/**
 * 도메인별 그라데이션 색상 생성
 */
export function getDomainColor(domain) {
    const colors = [
        ['#7b61ff', '#1a9b9f'], // 보라-청록 (기본)
        ['#ff6b6b', '#ff8787'], // 빨강
        ['#4ecdc4', '#44a08d'], // 청록-초록
        ['#f093fb', '#f5576c'], // 핑크-빨강
        ['#4facfe', '#00f2fe'], // 파랑
        ['#43e97b', '#38f9d7'], // 초록-청록
        ['#fa709a', '#fee140'], // 핑크-노랑
        ['#30cfd0', '#330867'], // 청록-보라
    ];

    // 도메인 문자열을 숫자로 변환하여 색상 선택
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * 도메인 첫 글자 추출
 */
export function getDomainInitial(domain) {
    // www. 제거하고 첫 글자 반환
    const cleanDomain = domain.replace('www.', '');
    return cleanDomain.charAt(0).toUpperCase();
}
