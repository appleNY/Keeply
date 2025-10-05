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
 * 링크 버튼 HTML 생성 (Linktree 스타일)
 */
function createLinkCard(link) {
    const summary = link.summary || getDefaultSummary(link.url);
    const summaryClass = link.summary ? '' : 'no-summary';
    const favoriteIcon = link.is_favorite ? '⭐' : '☆';

    return `
        <div class="link-button" onclick="openLink('${link.url}')">
            <span class="favorite-icon" onclick="event.stopPropagation(); toggleFavorite(${link.id})">
                ${favoriteIcon}
            </span>
            <div class="link-button-content">
                <img src="${link.thumbnail}" class="link-thumbnail-small" alt="${link.title}">
                <div class="link-info">
                    <div class="link-title">${link.title}</div>
                    <div class="link-description ${summaryClass}">${summary}</div>
                    <div class="link-meta">
                        <span>${link.domain}</span>
                        <span>${formatDate(link.saved_date)}</span>
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
        linkList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">저장된 링크가 없습니다.</p>';
        return;
    }

    linkList.innerHTML = linksToRender.map(link => createLinkCard(link)).join('');
}

/**
 * 링크 열기
 */
window.openLink = function(url) {
    window.open(url, '_blank');
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
