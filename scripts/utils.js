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
 * 도메인별 그라데이션 색상 생성 (Burnished Lilac 팔레트)
 */
export function getDomainColor(domain) {
    const colors = [
        ['#BA797D', '#8C3F5C'], // 기본: 분홍-진한분홍
        ['#C5AEBF', '#8C3F5C'], // 연한보라-진한분홍
        ['#E6CFD7', '#BA797D'], // 아주연한핑크-분홍
        ['#8C3F5C', '#330818'], // 진한분홍-가장진한
        ['#BA797D', '#00666C'], // 분홍-청록(포인트)
        ['#00666C', '#8C3F5C'], // 청록-진한분홍
        ['#C5AEBF', '#E6CFD7'], // 연한보라-아주연한핑크
        ['#330818', '#8C3F5C'], // 가장진한-진한분홍
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

/**
 * 도메인에 따른 아이콘 반환
 */
export function getDomainIcon(domain) {
    const lowerDomain = domain.toLowerCase();

    // 개발/코드 관련
    if (lowerDomain.includes('github')) return '💻';
    if (lowerDomain.includes('gitlab')) return '🦊';
    if (lowerDomain.includes('stackoverflow')) return '📚';
    if (lowerDomain.includes('developer.mozilla')) return '🔧';
    if (lowerDomain.includes('codepen')) return '✏️';

    // 디자인
    if (lowerDomain.includes('figma')) return '🎨';
    if (lowerDomain.includes('dribbble')) return '🏀';
    if (lowerDomain.includes('behance')) return '🎭';

    // 영상
    if (lowerDomain.includes('youtube') || lowerDomain.includes('youtu.be')) return '▶️';
    if (lowerDomain.includes('vimeo')) return '🎬';
    if (lowerDomain.includes('twitch')) return '📺';

    // 소셜미디어
    if (lowerDomain.includes('twitter') || lowerDomain.includes('x.com')) return '🐦';
    if (lowerDomain.includes('instagram')) return '📷';
    if (lowerDomain.includes('facebook')) return '👥';
    if (lowerDomain.includes('linkedin')) return '💼';

    // 블로그/문서
    if (lowerDomain.includes('medium')) return '📝';
    if (lowerDomain.includes('notion')) return '📋';
    if (lowerDomain.includes('blog') || lowerDomain.includes('tistory')) return '✍️';
    if (lowerDomain.includes('docs.') || lowerDomain.includes('documentation')) return '📖';

    // UI/CSS 프레임워크
    if (lowerDomain.includes('bootstrap')) return '🅱️';
    if (lowerDomain.includes('tailwind')) return '🌊';

    // 쇼핑
    if (lowerDomain.includes('amazon')) return '🛒';
    if (lowerDomain.includes('ebay') || lowerDomain.includes('shop')) return '🛍️';

    // 음악
    if (lowerDomain.includes('spotify')) return '🎵';
    if (lowerDomain.includes('soundcloud')) return '🎧';

    // 뉴스/미디어
    if (lowerDomain.includes('news') || lowerDomain.includes('naver')) return '📰';

    // 기본값
    return '🔗';
}
