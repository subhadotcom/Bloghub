// DOM elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Search functionality
function performSearch(query) {
    if (!query.trim()) {
        hideSearchResults();
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const postCards = document.querySelectorAll('.post-card');
    const results = [];
    
    postCards.forEach(card => {
        const titleElement = card.querySelector('h2');
        if (titleElement) {
            const title = titleElement.textContent;
            const titleLower = title.toLowerCase();
            const url = card.getAttribute('href');
            const content = card.querySelector('p')?.textContent || '';
            
            let score = 0;
            let matchType = '';
            
            // Exact title match (highest priority)
            if (titleLower === searchTerm) {
                score = 100;
                matchType = 'exact';
            }
            // Title starts with search term
            else if (titleLower.startsWith(searchTerm)) {
                score = 90;
                matchType = 'starts-with';
            }
            // Title contains search term
            else if (titleLower.includes(searchTerm)) {
                score = 80;
                matchType = 'contains';
            }
            // Word boundary match
            else {
                const titleWords = titleLower.split(/\s+/);
                const searchWords = searchTerm.split(/\s+/);
                const wordMatches = searchWords.filter(word => 
                    titleWords.some(titleWord => titleWord.startsWith(word))
                ).length;
                
                if (wordMatches > 0) {
                    score = 70 + (wordMatches * 10);
                    matchType = 'word-match';
                }
            }
            
            if (score > 0) {
                results.push({ 
                    title: title, 
                    url, 
                    content,
                    score,
                    matchType
                });
            }
        }
    });
    
    // Sort results by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    displaySearchResults(results, searchTerm);
}

function displaySearchResults(results, searchTerm) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div style="padding: 1rem; color: #888; text-align: center;">
                    <div>No results found for "${searchTerm}"</div>
                </div>
            </div>
        `;
    } else {
        searchResults.innerHTML = `
            <div class="search-result-item" style="padding: 0.75rem 1rem; border-bottom: 1px solid #404040; color: #4da6ff; font-size: 0.9rem; font-weight: 500;">
                Found ${results.length} result${results.length > 1 ? 's' : ''} for "${searchTerm}"
            </div>
            ${results.map((post, index) => `
                <div class="search-result-item">
                    <a href="${post.url}" style="color: #e0e0e0; text-decoration: none; display: block;" onclick="clearSearch()">
                        <h3>${post.title}</h3>
                        <p>${post.content.substring(0, 80)}...</p>
                    </a>
                </div>
            `).join('')}
        `;
    }
    
    showSearchResults();
}

function clearSearch() {
    searchInput.value = '';
    hideSearchResults();
    searchInput.blur();
}

function showSearchResults() {
    searchResults.style.display = 'block';
}

function hideSearchResults() {
    searchResults.style.display = 'none';
}

// Share functionality
function initializeShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showShareOptions();
        });
    });
    
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleBookmark();
        });
    });
}

function showShareOptions() {
    // Remove existing share modal if any
    const existingModal = document.querySelector('.share-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const currentUrl = window.location.href;
    const currentTitle = document.querySelector('.post-info h2')?.textContent || 'Blog Post';
    const currentDescription = document.querySelector('.post-body p')?.textContent || 'Check out this amazing blog post!';
    
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Share this post</h3>
                <button class="close-share-modal" onclick="closeShareModal()">×</button>
            </div>
            <div class="share-options">
                <button class="share-option" onclick="shareToTwitter('${currentTitle}', '${currentUrl}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                </button>
                <button class="share-option" onclick="shareToFacebook('${currentUrl}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </button>
                <button class="share-option" onclick="shareToLinkedIn('${currentTitle}', '${currentUrl}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </button>
                <button class="share-option" onclick="shareToWhatsApp('${currentTitle}', '${currentUrl}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WhatsApp
                </button>
                <button class="share-option" onclick="copyToClipboard('${currentUrl}')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy Link
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Close modal when clicking outside
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            closeShareModal();
        }
    });
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

function shareToTwitter(title, url) {
    const text = encodeURIComponent(`Check out this post: ${title}`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareModal();
}

function shareToFacebook(url) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareModal();
}

function shareToLinkedIn(title, url) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareModal();
}

function shareToWhatsApp(title, url) {
    const text = encodeURIComponent(`Check out this post: ${title} ${url}`);
    const shareUrl = `https://wa.me/?text=${text}`;
    window.open(shareUrl, '_blank');
    closeShareModal();
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification();
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
    closeShareModal();
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification() {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = 'Link copied to clipboard!';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4da6ff;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}


// Event listeners
searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
        performSearch(searchInput.value);
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        hideSearchResults();
    }
});

// Keyboard navigation
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearSearch();
    } else if (e.key === 'Enter') {
        const firstResult = searchResults.querySelector('a');
        if (firstResult) {
            firstResult.click();
        }
    }
});

// Back button functionality
function goBack() {
    // Check if there's a previous page in history
    if (document.referrer && document.referrer.includes(window.location.origin)) {
        window.history.back();
    } else {
        // Fallback to index page
        window.location.href = 'index.html';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Search initialized');
    initializeShareButtons();
    
    // Check if current page is bookmarked
    const currentUrl = window.location.href;
    const bookmarks = JSON.parse(localStorage.getItem('blogBookmarks') || '[]');
    const isBookmarked = bookmarks.some(bookmark => bookmark.url === currentUrl);
    
    if (isBookmarked) {
        const bookmarkBtn = document.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.classList.add('bookmarked');
            bookmarkBtn.textContent = 'Bookmarked ✓';
        }
    }
});