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
 * HTML에서 본문 텍스트 추출 (첫 문단)
 */
function extractBodyText(doc) {
    // 불필요한 태그 제거
    const unwantedSelectors = 'script, style, nav, header, footer, aside, iframe, noscript';
    doc.querySelectorAll(unwantedSelectors).forEach(el => el.remove());

    // 본문 텍스트 후보 찾기 (우선순위 순)
    const candidates = [
        doc.querySelector('article p'),
        doc.querySelector('main p'),
        doc.querySelector('[role="main"] p'),
        doc.querySelector('.content p'),
        doc.querySelector('.post p'),
        doc.querySelector('.article p'),
        doc.querySelector('p')
    ];

    // 유효한 첫 번째 문단 찾기
    for (const candidate of candidates) {
        if (candidate) {
            const text = candidate.textContent.trim();
            // 최소 20자 이상인 문단만 사용
            if (text.length >= 20) {
                // 최대 150자로 제한
                return text.length > 150 ? text.substring(0, 150) + '...' : text;
            }
        }
    }

    return '';
}

/**
 * 제목에서 요약 생성 (긴 제목을 짧게)
 */
function summarizeTitle(title) {
    if (!title) return '';

    // 제목이 짧으면 그대로 반환
    if (title.length <= 60) {
        return title;
    }

    // 긴 제목은 첫 60자만 + "..."
    return title.substring(0, 60) + '...';
}

/**
 * 소셜미디어 링크 감지 (백업용)
 */
function isSocialMediaLink(url) {
    const urlLower = url.toLowerCase();
    return urlLower.includes('facebook.com') || urlLower.includes('fb.com') || urlLower.includes('fb.me') ||
           urlLower.includes('instagram.com') || urlLower.includes('instagr.am') ||
           urlLower.includes('twitter.com') || urlLower.includes('x.com') || urlLower.includes('t.co') ||
           urlLower.includes('tiktok.com') || urlLower.includes('linkedin.com');
}

/**
 * Instagram 링크 감지
 */
function isInstagramLink(url) {
    const urlLower = url.toLowerCase();
    return urlLower.includes('instagram.com') || urlLower.includes('instagr.am');
}

/**
 * Instagram oEmbed API를 사용하여 메타데이터 가져오기
 */
async function fetchInstagramMetadata(url) {
    const apiUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(apiUrl, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('Instagram oEmbed API 요청 실패');
        }

        const data = await response.json();

        // Instagram oEmbed 응답에서 정보 추출
        return {
            title: truncateTitle(data.title || 'Instagram 게시물'),
            description: truncateDescription(data.author_name ? `@${data.author_name}의 게시물` : 'Instagram 게시물'),
            thumbnail: data.thumbnail_url || ''
        };
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * 텍스트 길이 제한 (제목용)
 */
function truncateTitle(text, maxLength = 50) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * 텍스트 길이 제한 (설명용)
 */
function truncateDescription(text, maxLength = 100) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * LinkPreview API를 사용하여 메타데이터 가져오기
 */
async function fetchWithLinkPreview(url) {
    const apiUrl = `https://api.linkpreview.net/?q=${encodeURIComponent(url)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(apiUrl, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('LinkPreview API 요청 실패');
        }

        const data = await response.json();

        return {
            title: truncateTitle(data.title || ''),
            description: truncateDescription(data.description || ''),
            thumbnail: data.image || ''
        };
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * URL에서 메타데이터 가져오기 (Open Graph 태그 활용)
 * Instagram oEmbed → LinkPreview API → AllOrigins 순서로 시도
 */
export async function fetchMetadata(url) {
    try {
        // URL 유효성 검사
        const urlObj = new URL(url);

        // Instagram 링크는 oEmbed API 우선 시도
        if (isInstagramLink(url)) {
            try {
                const metadata = await fetchInstagramMetadata(url);
                console.log('✅ Instagram oEmbed API 성공:', metadata);
                return metadata;
            } catch (instagramError) {
                console.log('⚠️ Instagram oEmbed API 실패, LinkPreview로 시도:', instagramError.message);
            }
        }

        // LinkPreview API 시도 (일반 링크 및 Instagram 백업)
        try {
            const metadata = await fetchWithLinkPreview(url);

            // 제목이 있으면 성공
            if (metadata.title) {
                console.log('✅ LinkPreview API 성공:', metadata);
                return metadata;
            }
        } catch (apiError) {
            console.log('⚠️ LinkPreview API 실패, AllOrigins로 시도:', apiError.message);
        }

        // LinkPreview 실패 시 AllOrigins API 사용 (타임아웃 5초)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/html'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error('페이지를 불러올 수 없습니다');
        }

        const html = await response.text();

        // HTML을 파싱하여 메타 태그 추출
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Open Graph 메타 태그 우선 추출
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
        const ogDescription = doc.querySelector('meta[property="og:description"]')?.content;
        const ogImage = doc.querySelector('meta[property="og:image"]')?.content;

        // 백업: 일반 메타 태그
        const metaDescription = doc.querySelector('meta[name="description"]')?.content;
        const titleTag = doc.querySelector('title')?.textContent;

        // 제목 결정
        const finalTitle = ogTitle || titleTag || urlObj.hostname;

        // 설명 결정 (우선순위: OG > 일반 메타 > 본문 첫 문단 > 제목 요약)
        let finalDescription = ogDescription || metaDescription;

        if (!finalDescription) {
            // 본문에서 첫 문단 추출 시도
            const bodyText = extractBodyText(doc);
            finalDescription = bodyText || summarizeTitle(finalTitle);
        }

        // 결과 반환 (길이 제한 적용)
        return {
            title: truncateTitle(finalTitle),
            description: truncateDescription(finalDescription),
            thumbnail: ogImage || ''
        };

    } catch (error) {
        console.error('메타데이터 가져오기 실패:', error);

        // 실패 시 기본값 반환
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname.replace('www.', '');

            // 소셜미디어 링크인지 확인
            const isSocial = isSocialMediaLink(url);

            // 타임아웃 에러인 경우
            if (error.name === 'AbortError') {
                return {
                    title: hostname,
                    description: isSocial
                        ? '소셜미디어 링크는 자동으로 정보를 가져올 수 없습니다. 제목과 설명을 직접 입력해주세요.'
                        : '링크 정보를 불러오는데 시간이 초과되었습니다. 제목과 설명을 직접 입력해주세요.',
                    thumbnail: '',
                    isSocialMedia: isSocial
                };
            }

            // 기타 에러
            return {
                title: hostname,
                description: isSocial
                    ? '소셜미디어 링크는 자동으로 정보를 가져올 수 없습니다. 제목과 설명을 직접 입력해주세요.'
                    : '링크 정보를 자동으로 가져올 수 없습니다. 제목과 설명을 직접 입력해주세요.',
                thumbnail: '',
                isSocialMedia: isSocial
            };
        } catch {
            return {
                title: url,
                description: '제목과 설명을 직접 입력해주세요.',
                thumbnail: ''
            };
        }
    }
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
