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
