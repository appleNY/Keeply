// 메인 애플리케이션 로직
import { getDomain, formatDate, getDefaultSummary, getDomainColor, getDomainInitial, getDomainIcon, fetchMetadata } from './utils.js';
import { initAuth, getCurrentUser, getLinks, addLink as firebaseAddLink, updateLink as firebaseUpdateLink, deleteLink as firebaseDeleteLink, getUserProfile, logOut, uploadImage, deleteImage } from './firebase.js';

// LocalStorage 키 (마이그레이션용)
const STORAGE_KEY = 'keeply_links';

// 현재 사용자 정보
let userProfile = null;

/**
 * LocalStorage에서 링크 불러오기
 */
function loadLinksFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('LocalStorage 불러오기 실패:', error);
    }

    // LocalStorage에 데이터가 없으면 기본 샘플 데이터 반환
    return [
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
}

/**
 * LocalStorage에 링크 저장
 */
function saveLinksToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
        console.log('✅ LocalStorage 저장 완료');
    } catch (error) {
        console.error('❌ LocalStorage 저장 실패:', error);
    }
}

// 링크 데이터 (LocalStorage에서 불러오기)
let links = loadLinksFromStorage();

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

    // 메모 표시
    const memoHTML = link.memo ? `
        <div class="link-memo">
            <span class="memo-icon">💬</span>
            <span class="memo-text">${link.memo}</span>
        </div>
    ` : '';

    return `
        <div class="link-button" data-link-id="${link.id}">
            <span class="favorite-icon" onclick="event.stopPropagation(); toggleFavorite(${link.id})">
                ${favoriteIcon}
            </span>
            <button class="edit-btn" onclick="event.stopPropagation(); openEditModal(${link.id})" title="수정">
                ✏️
            </button>
            <button class="memo-btn" onclick="event.stopPropagation(); openMemoModal(${link.id})" title="메모 ${link.memo ? '수정' : '추가'}">
                💬
            </button>
            <button class="delete-btn" onclick="event.stopPropagation(); confirmDelete(this)" title="삭제">
                🗑️
            </button>
            <span class="delete-indicator">🗑️</span>
            <div class="link-button-content" onclick="openLink('${link.url}')">
                ${thumbnailHTML}
                <div class="link-info">
                    <div class="link-title">${link.title}</div>
                    <div class="link-description ${summaryClass}">${summary}</div>
                    ${memoHTML}
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
    const addLinkBtn = document.getElementById('addLinkBtn');

    if (linksToRender.length === 0) {
        linkList.innerHTML = createEmptyState();
        // 링크가 없으면 하단 고정 버튼 숨김
        if (addLinkBtn) {
            addLinkBtn.style.display = 'none';
        }
        return;
    }

    linkList.innerHTML = linksToRender.map(link => createLinkCard(link)).join('');

    // 링크가 있으면 하단 고정 버튼 표시
    if (addLinkBtn) {
        addLinkBtn.style.display = 'flex';
    }

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
 * 메모 모달 열기
 */
let currentMemoLinkId = null;

window.openMemoModal = function(linkId) {
    currentMemoLinkId = linkId;
    const link = links.find(l => l.id === linkId);

    if (link) {
        const memoModal = document.getElementById('memoModal');
        const memoText = document.getElementById('memoText');
        const memoModalTitle = document.getElementById('memoModalTitle');

        // 기존 메모가 있으면 표시
        memoText.value = link.memo || '';
        memoModalTitle.textContent = link.memo ? '메모 수정' : '메모 추가';

        memoModal.classList.add('show');
    }
}

/**
 * 메모 저장
 */
async function saveMemo() {
    if (currentMemoLinkId === null) return;

    const link = links.find(l => l.id === currentMemoLinkId);
    const memoText = document.getElementById('memoText').value.trim();

    if (link && memoText) {
        try {
            // Firebase 업데이트
            await firebaseUpdateLink(currentMemoLinkId, {
                memo: memoText
            });

            // 로컬 배열도 업데이트
            link.memo = memoText;

            renderLinks();

            // 모달 닫기
            const memoModal = document.getElementById('memoModal');
            memoModal.classList.remove('show');

            console.log(`✅ 링크 ${currentMemoLinkId} 메모 저장:`, memoText);
        } catch (error) {
            console.error('❌ 메모 저장 실패:', error);
            alert('메모 저장에 실패했습니다.');
        }
    }

    currentMemoLinkId = null;
}

/**
 * 즐겨찾기 토글
 */
window.toggleFavorite = async function(linkId) {
    const link = links.find(l => l.id === linkId);
    if (link) {
        const newFavoriteState = !link.is_favorite;

        try {
            // Firebase 업데이트
            await firebaseUpdateLink(linkId, {
                is_favorite: newFavoriteState
            });

            // 로컬 배열도 업데이트
            link.is_favorite = newFavoriteState;

            // 애니메이션을 위해 아이콘 찾기
            const icons = document.querySelectorAll('.favorite-icon');
            icons.forEach(icon => {
                if (icon.onclick && icon.onclick.toString().includes(`toggleFavorite(${linkId})`)) {
                    icon.classList.add('favorited');
                    setTimeout(() => icon.classList.remove('favorited'), 600);
                }
            });

            renderLinks();
            console.log(`✅ 링크 ${linkId} 즐겨찾기: ${link.is_favorite}`);
        } catch (error) {
            console.error('❌ 즐겨찾기 업데이트 실패:', error);
            alert('즐겨찾기 업데이트에 실패했습니다.');
        }
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
    const addLinkBtn = document.getElementById('addLinkBtn');

    if (filtered.length === 0 && query.trim() !== '') {
        // 검색 결과가 없을 때
        linkList.innerHTML = createNoResultsState(query);
        // 검색 결과 없어도 원본 데이터가 있으면 버튼 표시
        if (addLinkBtn) {
            addLinkBtn.style.display = links.length > 0 ? 'flex' : 'none';
        }
    } else if (filtered.length === 0 && query.trim() === '') {
        // 검색어가 없고 원본 데이터도 없을 때
        linkList.innerHTML = createEmptyState();
        if (addLinkBtn) {
            addLinkBtn.style.display = 'none';
        }
    } else {
        // 검색 결과가 있을 때
        linkList.innerHTML = filtered.map(link => createLinkCard(link)).join('');
        if (addLinkBtn) {
            addLinkBtn.style.display = 'flex';
        }
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
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isSwiping = false;
        let hasMoved = false; // 실제로 움직였는지 체크

        button.addEventListener('touchstart', (e) => {
            // 버튼 클릭은 무시
            if (e.target.closest('.favorite-icon, .edit-btn, .memo-btn, .delete-btn')) {
                return;
            }

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
            hasMoved = false;
        });

        button.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            const diffX = currentX - startX;
            const diffY = currentY - startY;

            // 수평 이동이 수직 이동보다 클 때만 스와이프로 인식
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                isSwiping = true;
                hasMoved = true;
                button.classList.add('swiping');
            }

            // 스와이프 중일 때만 처리
            if (isSwiping) {
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
            }
        });

        button.addEventListener('touchend', (e) => {
            const diffX = currentX - startX;
            button.classList.remove('swiping');

            // 실제로 스와이프했을 때만 삭제 처리
            if (isSwiping && hasMoved && Math.abs(diffX) > 120) {
                showDeleteModal(button);
            }

            // 원래 위치로 복귀
            button.style.transform = '';
            button.classList.remove('swipe-delete');

            // 리셋
            isSwiping = false;
            hasMoved = false;
            startX = 0;
            startY = 0;
            currentX = 0;
            currentY = 0;
        });
    });
}

/**
 * URL에서 메타데이터 자동 가져오기
 */
let currentMetadata = null; // 가져온 메타데이터를 저장 (썸네일 포함)

async function autoFillMetadata(url) {
    // URL이 유효한지 확인
    if (!url || url.trim() === '') {
        return;
    }

    try {
        new URL(url); // URL 유효성 검사
    } catch {
        return; // 유효하지 않은 URL이면 종료
    }

    // 로딩 상태 표시
    const urlHint = document.getElementById('urlHint');
    const urlLoading = document.getElementById('urlLoading');
    const urlWarning = document.getElementById('urlWarning');
    const titleInput = document.getElementById('linkTitle');
    const descriptionInput = document.getElementById('linkDescription');

    urlHint.style.display = 'none';
    urlWarning.style.display = 'none';
    urlLoading.style.display = 'flex';

    try {
        // 메타데이터 가져오기
        const metadata = await fetchMetadata(url);

        // 메타데이터 저장 (썸네일 포함)
        currentMetadata = metadata;

        // 폼 자동 채우기 (비어있을 때만)
        if (!titleInput.value && metadata.title) {
            titleInput.value = metadata.title;
        }
        if (!descriptionInput.value && metadata.description) {
            descriptionInput.value = metadata.description;
        }

        // 소셜미디어 링크일 경우 경고 표시
        if (metadata.isSocialMedia) {
            urlWarning.style.display = 'block';
            urlHint.style.display = 'none';
        } else {
            urlWarning.style.display = 'none';
            urlHint.style.display = 'block';
        }

        console.log('메타데이터 가져오기 성공:', metadata);

    } catch (error) {
        console.error('메타데이터 가져오기 실패:', error);
        currentMetadata = null;

        // 네트워크 에러 처리
        let errorMessage = '링크 정보를 불러오지 못했습니다.';

        if (error.name === 'AbortError') {
            errorMessage = '요청 시간이 초과되었습니다. 제목과 설명을 직접 입력해주세요.';
        } else if (!navigator.onLine) {
            errorMessage = '인터넷 연결을 확인해주세요.';
        } else {
            errorMessage = '링크 정보를 자동으로 가져올 수 없습니다. 제목과 설명을 직접 입력해주세요.';
        }

        // 에러 메시지 표시
        showUrlError(errorMessage);
    } finally {
        // 로딩 상태 숨기기
        urlLoading.style.display = 'none';
    }
}

/**
 * 링크 수정 모달 열기
 */
let currentEditingLinkId = null;

window.openEditModal = function(linkId) {
    currentEditingLinkId = linkId;
    const link = links.find(l => l.id === linkId);

    if (link) {
        const addLinkModal = document.getElementById('addLinkModal');
        const modalTitle = document.getElementById('addLinkModalTitle');
        const urlInput = document.getElementById('linkUrl');
        const titleInput = document.getElementById('linkTitle');
        const descriptionInput = document.getElementById('linkDescription');

        // 모달 제목 변경
        modalTitle.textContent = '링크 수정';

        // 기존 데이터 채우기
        urlInput.value = link.url;
        titleInput.value = link.title;
        descriptionInput.value = link.summary || '';

        // URL 필드 비활성화 (URL은 수정 불가)
        urlInput.disabled = true;

        // 메타데이터 저장 (썸네일 유지)
        currentMetadata = {
            thumbnail: link.thumbnail
        };

        // 모달 열기
        addLinkModal.classList.add('show');

        // 힌트 숨기기
        document.getElementById('urlHint').style.display = 'none';
        document.getElementById('urlLoading').style.display = 'none';
        document.getElementById('urlWarning').style.display = 'none';
        hideUrlError(); // 에러 메시지 숨기기
    }
}

/**
 * 에러 메시지 표시 함수
 */
function showUrlError(message) {
    const urlError = document.getElementById('urlError');
    const urlHint = document.getElementById('urlHint');
    const urlLoading = document.getElementById('urlLoading');
    const urlWarning = document.getElementById('urlWarning');

    // 다른 힌트들 숨기기
    urlHint.style.display = 'none';
    urlLoading.style.display = 'none';
    urlWarning.style.display = 'none';

    // 에러 메시지 표시
    urlError.textContent = `❌ ${message}`;
    urlError.style.display = 'block';
}

/**
 * 에러 메시지 숨기기
 */
function hideUrlError() {
    const urlError = document.getElementById('urlError');
    urlError.style.display = 'none';
}

/**
 * URL 유효성 검사
 */
function validateUrl(url, isEditMode = false) {
    // 1. URL 형식 검사
    try {
        new URL(url);
    } catch (error) {
        showUrlError('올바른 URL 형식이 아닙니다. https:// 또는 http://로 시작하는 주소를 입력해주세요.');
        return false;
    }

    // 2. 중복 URL 검사 (추가 모드일 때만)
    if (!isEditMode) {
        const isDuplicate = links.some(link => link.url === url);
        if (isDuplicate) {
            showUrlError('이미 저장된 링크입니다. 다른 URL을 입력해주세요.');
            return false;
        }
    }

    return true;
}

/**
 * 링크 추가/수정 처리
 */
async function handleAddLink() {
    console.log('🔵 handleAddLink 시작');

    // 폼 데이터 가져오기
    const url = document.getElementById('linkUrl').value.trim();
    const title = document.getElementById('linkTitle').value.trim();
    const description = document.getElementById('linkDescription').value.trim();

    console.log('📝 입력 데이터:', { url, title, description });

    // 에러 메시지 초기화
    hideUrlError();

    // 현재 사용자 확인
    const user = getCurrentUser();
    console.log('👤 현재 사용자:', user ? user.uid : 'null');

    if (!user) {
        console.error('❌ 사용자 없음');
        showUrlError('로그인이 필요합니다.');
        return;
    }

    // 수정 모드인지 확인
    if (currentEditingLinkId !== null) {
        // 링크 수정
        const link = links.find(l => l.id === currentEditingLinkId);
        if (link) {
            try {
                // Firebase 업데이트
                await firebaseUpdateLink(currentEditingLinkId, {
                    title: title,
                    summary: description
                });

                // 로컬 배열도 업데이트
                link.title = title;
                link.summary = description;

                // 화면 갱신
                renderLinks();

                console.log('✅ 링크 수정됨:', link);
            } catch (error) {
                console.error('❌ 링크 수정 실패:', error);
                showUrlError('링크 수정에 실패했습니다.');
                return;
            }
        }

        // 수정 모드 종료
        currentEditingLinkId = null;
    } else {
        // 링크 추가
        // URL 유효성 검사
        if (!validateUrl(url, false)) {
            return; // 유효하지 않으면 추가 중단
        }

        // URL에서 도메인 추출
        const domain = getDomain(url);

        // 썸네일: 메타데이터에서 가져온 것 사용, 없으면 placeholder
        const thumbnail = (currentMetadata && currentMetadata.thumbnail)
            ? currentMetadata.thumbnail
            : `https://via.placeholder.com/400x200?text=${encodeURIComponent(title)}`;

        // 새 링크 객체 생성
        const newLinkData = {
            title: title,
            summary: description,
            url: url,
            thumbnail: thumbnail,
            domain: domain,
            saved_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 형식
            is_favorite: false
        };

        console.log('🔥 Firebase에 저장 시작:', newLinkData);

        try {
            // Firebase에 추가
            const firebaseId = await firebaseAddLink(newLinkData, user.uid);
            console.log('✅ Firebase 저장 성공, ID:', firebaseId);

            // 로컬 배열에도 추가 (Firebase ID 사용)
            const newLink = {
                id: firebaseId,
                ...newLinkData
            };
            links.unshift(newLink);
            console.log('✅ 로컬 배열 업데이트 완료');

            // 화면 갱신
            renderLinks();
            console.log('✅ 화면 렌더링 완료');

            console.log('✅ 새 링크 추가 완료:', newLink);

            // 맨 위로 스크롤
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('❌ 링크 추가 실패 (상세):', error);
            console.error('❌ 에러 코드:', error.code);
            console.error('❌ 에러 메시지:', error.message);
            showUrlError(`링크 추가에 실패했습니다: ${error.message}`);
            return;
        }
    }

    // 모달 닫기
    const addLinkModal = document.getElementById('addLinkModal');
    addLinkModal.classList.remove('show');

    // 메타데이터 초기화
    currentMetadata = null;
}

/**
 * 삭제 확인 함수 (버튼 클릭 시)
 */
window.confirmDelete = function(button) {
    // 가장 가까운 link-button 요소 찾기
    const linkButton = button.closest('.link-button');
    showDeleteModal(linkButton);
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
async function deleteLink(buttonElement) {
    const linkId = buttonElement.getAttribute('data-link-id');

    // 삭제 애니메이션
    buttonElement.style.transform = 'translateX(-100%)';
    buttonElement.style.opacity = '0';

    setTimeout(async () => {
        try {
            // Firebase에서 삭제
            await firebaseDeleteLink(linkId);

            // 로컬 배열에서도 삭제
            links = links.filter(link => link.id !== linkId);

            renderLinks();
            console.log(`✅ 링크 ${linkId} 삭제됨`);
        } catch (error) {
            console.error('❌ 링크 삭제 실패:', error);
            alert('링크 삭제에 실패했습니다.');
            // 애니메이션 복구
            buttonElement.style.transform = '';
            buttonElement.style.opacity = '';
        }
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

    // 메모 모달
    const memoModal = document.getElementById('memoModal');
    const closeMemoModalBtn = document.getElementById('closeMemoModalBtn');
    const cancelMemoBtn = document.getElementById('cancelMemoBtn');
    const memoForm = document.getElementById('memoForm');

    // 메모 모달 닫기
    closeMemoModalBtn.addEventListener('click', () => {
        memoModal.classList.remove('show');
        currentMemoLinkId = null;
    });

    cancelMemoBtn.addEventListener('click', () => {
        memoModal.classList.remove('show');
        currentMemoLinkId = null;
    });

    // 메모 모달 오버레이 클릭 시 닫기
    memoModal.addEventListener('click', (e) => {
        if (e.target === memoModal) {
            memoModal.classList.remove('show');
            currentMemoLinkId = null;
        }
    });

    // 메모 폼 제출
    memoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveMemo();
    });

    // 새 링크 추가 모달
    const addLinkBtn = document.getElementById('addLinkBtn');
    const addLinkModal = document.getElementById('addLinkModal');
    const closeLinkModalBtn = document.getElementById('closeLinkModalBtn');
    const cancelLinkBtn = document.getElementById('cancelLinkBtn');
    const linkForm = document.getElementById('linkForm');
    const linkUrlInput = document.getElementById('linkUrl');

    // 모달 열기 - 타입 선택 모달 표시
    addLinkBtn.addEventListener('click', () => {
        showTypeSelectModal();
    });

    // URL 입력 필드에서 메타데이터 자동 가져오기
    let urlFetchTimeout = null;
    let lastFetchedUrl = '';

    // 입력 중에 실시간으로 감지 (debounce)
    linkUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();

        // 이전 타이머 취소
        if (urlFetchTimeout) {
            clearTimeout(urlFetchTimeout);
        }

        // URL이 비어있거나 이미 가져온 URL이면 종료
        if (!url || url === lastFetchedUrl) {
            return;
        }

        // URL 형식 간단 체크
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return;
        }

        // 1초 대기 후 메타데이터 가져오기 (사용자가 입력을 멈출 때까지 대기)
        urlFetchTimeout = setTimeout(() => {
            lastFetchedUrl = url;
            autoFillMetadata(url);
        }, 1000);
    });

    // 포커스 벗어날 때도 체크 (입력 완료 시)
    linkUrlInput.addEventListener('blur', (e) => {
        const url = e.target.value.trim();
        if (url && url !== lastFetchedUrl) {
            // 타이머 취소하고 즉시 가져오기
            if (urlFetchTimeout) {
                clearTimeout(urlFetchTimeout);
            }
            lastFetchedUrl = url;
            autoFillMetadata(url);
        }
    });

    // 모달 닫기
    closeLinkModalBtn.addEventListener('click', () => {
        addLinkModal.classList.remove('show');
    });

    cancelLinkBtn.addEventListener('click', () => {
        addLinkModal.classList.remove('show');
    });

    // 오버레이 클릭 시 모달 닫기
    addLinkModal.addEventListener('click', (e) => {
        if (e.target === addLinkModal) {
            addLinkModal.classList.remove('show');
        }
    });

    // 폼 제출 처리
    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddLink();
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

    // 타입 선택 모달
    initTypeSelectModal();

    // 이미지 추가 모달
    initImageModal();
}

/**
 * 타입 선택 모달 초기화
 */
function initTypeSelectModal() {
    const typeSelectModal = document.getElementById('typeSelectModal');
    const selectLinkTypeBtn = document.getElementById('selectLinkTypeBtn');
    const selectImageTypeBtn = document.getElementById('selectImageTypeBtn');
    const cancelTypeSelectBtn = document.getElementById('cancelTypeSelectBtn');

    // 웹 링크 선택
    selectLinkTypeBtn.addEventListener('click', () => {
        hideTypeSelectModal();

        // 폼 초기화
        const linkForm = document.getElementById('linkForm');
        linkForm.reset();

        // 모달 제목 설정
        document.getElementById('addLinkModalTitle').textContent = '새 링크 추가';

        // URL 필드 활성화
        const linkUrlInput = document.getElementById('linkUrl');
        linkUrlInput.disabled = false;

        // 힌트 표시 초기화
        document.getElementById('urlHint').style.display = 'block';
        document.getElementById('urlLoading').style.display = 'none';
        document.getElementById('urlWarning').style.display = 'none';
        const urlError = document.getElementById('urlError');
        if (urlError) urlError.style.display = 'none';

        // 기존 링크 추가 모달 열기
        const addLinkModal = document.getElementById('addLinkModal');
        addLinkModal.classList.add('show');
    });

    // 이미지 선택
    selectImageTypeBtn.addEventListener('click', () => {
        hideTypeSelectModal();
        // 이미지 추가 모달 열기
        const addImageModal = document.getElementById('addImageModal');
        addImageModal.classList.add('show');
    });

    // 취소 버튼
    cancelTypeSelectBtn.addEventListener('click', () => {
        hideTypeSelectModal();
    });

    // 모달 오버레이 클릭 시 닫기
    typeSelectModal.addEventListener('click', (e) => {
        if (e.target === typeSelectModal) {
            hideTypeSelectModal();
        }
    });
}

/**
 * 타입 선택 모달 표시
 */
function showTypeSelectModal() {
    const modal = document.getElementById('typeSelectModal');
    modal.classList.add('show');
}

/**
 * 타입 선택 모달 숨기기
 */
function hideTypeSelectModal() {
    const modal = document.getElementById('typeSelectModal');
    modal.classList.remove('show');
}

/**
 * 이미지 추가 모달 초기화
 */
function initImageModal() {
    const addImageModal = document.getElementById('addImageModal');
    const closeImageModalBtn = document.getElementById('closeImageModalBtn');
    const cancelImageBtn = document.getElementById('cancelImageBtn');
    const imageForm = document.getElementById('imageForm');
    const imageFile = document.getElementById('imageFile');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewGroup = document.getElementById('imagePreviewGroup');

    // 파일 선택 시 미리보기
    imageFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // 파일 크기 체크
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                showImageError('파일 크기는 5MB 이하여야 합니다.');
                imageFile.value = '';
                return;
            }

            // 이미지 파일 체크
            if (!file.type.startsWith('image/')) {
                showImageError('이미지 파일만 업로드 가능합니다.');
                imageFile.value = '';
                return;
            }

            // 미리보기 표시
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreviewGroup.style.display = 'block';
            };
            reader.readAsDataURL(file);

            // 에러 메시지 숨김
            hideImageError();
        }
    });

    // 모달 닫기 버튼
    closeImageModalBtn.addEventListener('click', () => {
        hideImageModal();
    });

    cancelImageBtn.addEventListener('click', () => {
        hideImageModal();
    });

    // 폼 제출
    imageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleImageSubmit();
    });

    // 모달 오버레이 클릭 시 닫기
    addImageModal.addEventListener('click', (e) => {
        if (e.target === addImageModal) {
            hideImageModal();
        }
    });
}

/**
 * 이미지 폼 제출 처리
 */
async function handleImageSubmit() {
    const imageFile = document.getElementById('imageFile').files[0];
    const imageTitle = document.getElementById('imageTitle').value.trim();
    const imageDescription = document.getElementById('imageDescription').value.trim();

    if (!imageFile || !imageTitle) {
        showImageError('이미지와 제목을 입력해주세요.');
        return;
    }

    try {
        // 로딩 상태 표시
        setImageSaveButtonLoading(true);

        // 사용자 정보 가져오기
        const user = getCurrentUser();
        if (!user) {
            throw new Error('로그인이 필요합니다.');
        }

        // 이미지 업로드
        const imageUrl = await uploadImage(imageFile, user.uid);

        // Firestore에 저장
        const imageData = {
            type: 'image',
            title: imageTitle,
            description: imageDescription,
            imageUrl: imageUrl,
            url: imageUrl, // 카드 렌더링 호환성을 위해
            thumbnail: imageUrl,
            created_at: new Date().toISOString(),
            favorite: false
        };

        await firebaseAddLink(imageData, user.uid);

        // 모달 닫기 및 폼 리셋
        hideImageModal();
        document.getElementById('imageForm').reset();
        document.getElementById('imagePreviewGroup').style.display = 'none';

        // 링크 목록 새로고침
        await loadLinksFromFirebase();
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        showImageError(error.message || '이미지 업로드에 실패했습니다.');
    } finally {
        setImageSaveButtonLoading(false);
    }
}

/**
 * 이미지 저장 버튼 로딩 상태 설정
 */
function setImageSaveButtonLoading(isLoading) {
    const saveImageBtn = document.getElementById('saveImageBtn');
    const saveImageBtnText = document.getElementById('saveImageBtnText');
    const saveImageBtnLoading = document.getElementById('saveImageBtnLoading');

    if (isLoading) {
        saveImageBtn.disabled = true;
        saveImageBtnText.style.display = 'none';
        saveImageBtnLoading.style.display = 'inline-flex';
    } else {
        saveImageBtn.disabled = false;
        saveImageBtnText.style.display = 'inline';
        saveImageBtnLoading.style.display = 'none';
    }
}

/**
 * 이미지 에러 메시지 표시
 */
function showImageError(message) {
    const imageError = document.getElementById('imageError');
    imageError.textContent = `❌ ${message}`;
    imageError.style.display = 'block';
}

/**
 * 이미지 에러 메시지 숨기기
 */
function hideImageError() {
    const imageError = document.getElementById('imageError');
    imageError.style.display = 'none';
}

/**
 * 이미지 모달 숨기기
 */
function hideImageModal() {
    const modal = document.getElementById('addImageModal');
    modal.classList.remove('show');
    document.getElementById('imageForm').reset();
    document.getElementById('imagePreviewGroup').style.display = 'none';
    hideImageError();
}

/**
 * 로그아웃 버튼 추가
 */
function addLogoutButton() {
    const profileSection = document.querySelector('.profile-section');

    // 이미 버튼이 있으면 추가하지 않음
    if (document.getElementById('logoutBtn')) return;

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logoutBtn';
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '로그아웃';
    logoutBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 8px 16px;
        background: transparent;
        border: 1px solid rgba(186, 121, 125, 0.3);
        border-radius: 20px;
        color: #BA797D;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.25s ease;
    `;

    logoutBtn.addEventListener('click', handleLogout);
    logoutBtn.addEventListener('mouseenter', () => {
        logoutBtn.style.background = '#BA797D';
        logoutBtn.style.color = 'white';
    });
    logoutBtn.addEventListener('mouseleave', () => {
        logoutBtn.style.background = 'transparent';
        logoutBtn.style.color = '#BA797D';
    });

    profileSection.style.position = 'relative';
    profileSection.appendChild(logoutBtn);
}

/**
 * 로그아웃 처리
 */
async function handleLogout() {
    if (!confirm('로그아웃하시겠습니까?')) return;

    const result = await logOut();
    if (result.success) {
        window.location.href = 'auth.html';
    } else {
        alert('로그아웃에 실패했습니다.');
    }
}

/**
 * 사용자 프로필 표시
 */
function displayUserProfile(profile) {
    const profileName = document.querySelector('.profile-name');
    const profileBio = document.querySelector('.profile-bio');

    if (profileName && profile.displayName) {
        profileName.textContent = profile.displayName;
    }

    if (profileBio && profile.bio) {
        profileBio.textContent = profile.bio;
    }
}

/**
 * Firebase에서 링크 데이터 로드
 */
async function loadLinksFromFirebase(userId) {
    try {
        const firebaseLinks = await getLinks(userId);
        console.log(`✅ Firebase에서 ${firebaseLinks.length}개 링크 로드 완료`);
        return firebaseLinks;
    } catch (error) {
        console.error('❌ Firebase 링크 로드 실패:', error);
        return [];
    }
}

/**
 * 앱 초기화
 */
function init() {
    console.log('Keeply 앱 시작!');

    // 로딩 표시
    showLoading();

    // Firebase 인증 상태 확인
    initAuth(async (user) => {
        if (!user) {
            // 로그인되지 않음 - 로그인 페이지로 리다이렉트
            console.log('로그인 필요 - auth.html로 이동');
            window.location.href = 'auth.html';
            return;
        }

        console.log('✅ 로그인됨:', user.email);

        try {
            // 사용자 프로필 가져오기
            const profileResult = await getUserProfile(user.uid);
            if (profileResult.success) {
                userProfile = profileResult.data;
                displayUserProfile(userProfile);
                console.log('✅ 사용자 프로필 로드 완료:', userProfile.displayName);
            }

            // Firebase에서 링크 데이터 로드
            const firebaseLinks = await loadLinksFromFirebase(user.uid);

            // LocalStorage 마이그레이션 체크 (첫 로그인 시)
            const localLinks = loadLinksFromStorage();
            // 샘플 데이터 필터링 (id가 1, 2, 3인 기본 샘플은 제외)
            const realLocalLinks = localLinks.filter(link => link.id > 3);

            if (realLocalLinks.length > 0 && firebaseLinks.length === 0) {
                console.log(`🔄 LocalStorage 데이터 ${realLocalLinks.length}개를 Firebase로 마이그레이션 시작...`);
                await migrateLocalStorageToFirebase(realLocalLinks, user.uid);
                // 마이그레이션 후 다시 로드
                links = await loadLinksFromFirebase(user.uid);
            } else {
                links = firebaseLinks;
                // LocalStorage 샘플 데이터만 있다면 삭제
                if (localLinks.length > 0 && realLocalLinks.length === 0) {
                    localStorage.removeItem(STORAGE_KEY);
                    console.log('🗑️ LocalStorage 샘플 데이터 삭제 완료');
                }
            }

            // UI 렌더링
            renderLinks();
            initEventListeners();
            addLogoutButton();

        } catch (error) {
            console.error('❌ 초기화 실패:', error);
            alert('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    });
}

/**
 * LocalStorage 데이터를 Firebase로 마이그레이션
 */
async function migrateLocalStorageToFirebase(localLinks, userId) {
    let successCount = 0;
    let failCount = 0;

    for (const link of localLinks) {
        try {
            // id 필드 제거 (Firebase가 자동 생성)
            const { id, ...linkData } = link;
            await firebaseAddLink(linkData, userId);
            successCount++;
            console.log(`✅ 마이그레이션 성공 (${successCount}/${localLinks.length}):`, link.title);
        } catch (error) {
            failCount++;
            console.error(`❌ 마이그레이션 실패 (${link.title}):`, error);
        }
    }

    // 마이그레이션 완료 후 LocalStorage 삭제
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ LocalStorage 데이터 삭제 완료');

    if (successCount > 0) {
        console.log(`✅ 마이그레이션 완료: ${successCount}개 성공, ${failCount}개 실패`);
        if (failCount === 0) {
            alert(`기존 데이터 ${successCount}개를 성공적으로 가져왔습니다!`);
        } else {
            alert(`기존 데이터 ${successCount}개를 가져왔습니다. (${failCount}개 실패)`);
        }
    }
}

// 페이지 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', init);
