// 메인 애플리케이션 로직
import { getDomain, formatDate, getDefaultSummary, getDomainColor, getDomainInitial, getDomainIcon } from './utils.js';

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
    },
    {
        id: 3,
        title: 'Keeply - GitHub 저장소',
        summary: '개인용 메모 및 링크 관리 웹앱',
        url: 'https://github.com/appleNY/Keeply',
        thumbnail: 'https://via.placeholder.com/400x200?text=GitHub',
        domain: 'github.com',
        saved_date: '2025-10-12',
        is_favorite: false
    }
];

/**
 * 링크 버튼 HTML 생성 (Linktree 스타일)
 */
function createLinkCard(link) {
    const summary = link.summary || getDefaultSummary(link.url);
    const summaryClass = link.summary ? '' : 'no-summary';
    const favoriteIcon = link.is_favorite ? '⭐' : '☆';

    // 썸네일 처리: placeholder면 기본 디자인 사용
    const isPlaceholder = link.thumbnail && link.thumbnail.includes('placeholder');
    const thumbnailHTML = isPlaceholder
        ? createDefaultThumbnail(link.domain)
        : `<img src="${link.thumbnail}" class="link-thumbnail-small" alt="${link.title}" loading="lazy">`;

    return `
        <div class="link-button" data-link-id="${link.id}" onclick="openLink('${link.url}')">
            <span class="favorite-icon" onclick="event.stopPropagation(); toggleFavorite(${link.id})">
                ${favoriteIcon}
            </span>
            <span class="delete-indicator">🗑️</span>
            <div class="link-button-content">
                ${thumbnailHTML}
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
 * 기본 썸네일 생성 (이미지 없을 때)
 */
function createDefaultThumbnail(domain) {
    const colors = getDomainColor(domain);
    const icon = getDomainIcon(domain);

    return `
        <div class="link-thumbnail-default" style="background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);">
            ${icon}
        </div>
    `;
}

/**
 * 로딩 스켈레톤 생성
 */
function createSkeletonCard() {
    return `
        <div class="skeleton-card">
            <div class="skeleton-card-content">
                <div class="skeleton-thumbnail"></div>
                <div class="skeleton-info">
                    <div class="skeleton-line title"></div>
                    <div class="skeleton-line description"></div>
                    <div class="skeleton-line meta"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 로딩 상태 표시
 */
function showLoading() {
    const linkList = document.getElementById('linkList');
    linkList.innerHTML = createSkeletonCard() + createSkeletonCard() + createSkeletonCard();
}

/**
 * 빈 상태 HTML 생성
 */
function createEmptyState() {
    return `
        <div class="empty-state">
            <div class="empty-icon">📭</div>
            <h3 class="empty-title">아직 저장된 링크가 없어요</h3>
            <p class="empty-message">첫 번째 링크를 추가하고<br>나만의 링크 컬렉션을 만들어보세요!</p>
            <button class="empty-cta" onclick="document.getElementById('addLinkBtn').click()">
                + 첫 링크 추가하기
            </button>
        </div>
    `;
}

/**
 * 검색 결과 없음 HTML 생성
 */
function createNoResultsState(query) {
    return `
        <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3 class="no-results-title">검색 결과가 없어요</h3>
            <p class="no-results-message">
                '<span class="no-results-query">${query}</span>'에 대한<br>
                검색 결과를 찾을 수 없습니다
            </p>
            <button class="clear-search-btn" onclick="clearSearch()">
                검색 초기화
            </button>
        </div>
    `;
}

/**
 * 검색 초기화
 */
window.clearSearch = function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    renderLinks();
}

/**
 * 링크 목록 화면에 표시
 */
function renderLinks(linksToRender = links) {
    const linkList = document.getElementById('linkList');

    if (linksToRender.length === 0) {
        linkList.innerHTML = createEmptyState();
        return;
    }

    linkList.innerHTML = linksToRender.map(link => createLinkCard(link)).join('');

    // 스와이프 기능 초기화
    initSwipeDelete();
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

        // 애니메이션을 위해 아이콘 찾기
        const icons = document.querySelectorAll('.favorite-icon');
        icons.forEach(icon => {
            if (icon.onclick && icon.onclick.toString().includes(`toggleFavorite(${linkId})`)) {
                icon.classList.add('favorited');
                setTimeout(() => icon.classList.remove('favorited'), 600);
            }
        });

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

    const linkList = document.getElementById('linkList');

    if (filtered.length === 0 && query.trim() !== '') {
        // 검색 결과가 없을 때
        linkList.innerHTML = createNoResultsState(query);
    } else if (filtered.length === 0 && query.trim() === '') {
        // 검색어가 없고 원본 데이터도 없을 때
        linkList.innerHTML = createEmptyState();
    } else {
        // 검색 결과가 있을 때
        linkList.innerHTML = filtered.map(link => createLinkCard(link)).join('');
        initSwipeDelete();
    }
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
 * 스와이프 삭제 기능 초기화
 */
function initSwipeDelete() {
    const linkButtons = document.querySelectorAll('.link-button');

    linkButtons.forEach(button => {
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;

        button.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = true;
            button.classList.add('swiping');
        });

        button.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;

            currentX = e.touches[0].clientX;
            const diffX = currentX - startX;

            // 왼쪽으로만 스와이프 가능
            if (diffX < 0) {
                e.preventDefault();
                button.style.transform = `translateX(${diffX}px)`;

                // 일정 거리 이상 스와이프하면 삭제 표시
                if (Math.abs(diffX) > 80) {
                    button.classList.add('swipe-delete');
                } else {
                    button.classList.remove('swipe-delete');
                }
            }
        });

        button.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            const diffX = currentX - startX;
            button.classList.remove('swiping');

            // 충분히 스와이프했으면 삭제 확인 모달 표시
            if (Math.abs(diffX) > 120) {
                showDeleteModal(button);
                // 원래 위치로 복귀
                button.style.transform = '';
                button.classList.remove('swipe-delete');
            } else {
                // 원래 위치로 복귀
                button.style.transform = '';
                button.classList.remove('swipe-delete');
            }

            isSwiping = false;
            startX = 0;
            currentX = 0;
        });
    });
}

/**
 * 삭제 확인 모달 표시
 */
let pendingDeleteElement = null;

function showDeleteModal(buttonElement) {
    pendingDeleteElement = buttonElement;
    const modal = document.getElementById('deleteModal');
    modal.classList.add('show');
}

function hideDeleteModal() {
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('show');
    pendingDeleteElement = null;
}

/**
 * 링크 삭제
 */
function deleteLink(buttonElement) {
    const linkId = parseInt(buttonElement.getAttribute('data-link-id'));

    // 삭제 애니메이션
    buttonElement.style.transform = 'translateX(-100%)';
    buttonElement.style.opacity = '0';

    setTimeout(() => {
        // 데이터에서 삭제
        links = links.filter(link => link.id !== linkId);
        renderLinks();
        console.log(`링크 ${linkId} 삭제됨`);
    }, 300);
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

    // 필터 칩
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // 모든 칩에서 active 제거
            filterChips.forEach(c => c.classList.remove('active'));
            // 클릭한 칩에 active 추가
            chip.classList.add('active');
            // 필터 적용
            const filterType = chip.getAttribute('data-filter');
            filterLinks(filterType);
        });
    });

    // 기존 select 필터 (숨겨져 있지만 유지)
    const filterSelect = document.getElementById('filterSelect');
    filterSelect.addEventListener('change', (e) => {
        filterLinks(e.target.value);
    });

    // 새 링크 추가 (임시)
    const addLinkBtn = document.getElementById('addLinkBtn');
    addLinkBtn.addEventListener('click', () => {
        alert('링크 추가 기능은 곧 구현됩니다!');
    });

    // 삭제 확인 모달 버튼
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteModal = document.getElementById('deleteModal');

    cancelDeleteBtn.addEventListener('click', () => {
        hideDeleteModal();
    });

    confirmDeleteBtn.addEventListener('click', () => {
        if (pendingDeleteElement) {
            deleteLink(pendingDeleteElement);
        }
        hideDeleteModal();
    });

    // 모달 오버레이 클릭 시 닫기
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            hideDeleteModal();
        }
    });
}

/**
 * 앱 초기화
 */
function init() {
    console.log('Keeply 앱 시작!');

    // 로딩 표시
    showLoading();

    // 실제 데이터 로드 시뮬레이션 (나중에 Firebase로 대체)
    setTimeout(() => {
        renderLinks();
        initEventListeners();
    }, 800);
}

// 페이지 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', init);
