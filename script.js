// DOM elements
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Debug logging removed for production

// Validate DOM elements
if (!searchInput) {
    console.error('Search input element not found! Make sure element with id="searchInput" exists.');
}
if (!searchResults) {
    console.error('Search results element not found! Make sure element with id="searchResults" exists.');
}

// Enhanced search functionality with optimized fuzzy matching
function performSearch(query) {
    if (!query || !query.trim()) {
        hideSearchResults();
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const postCards = document.querySelectorAll('.post-card');
    const results = [];
    
    // Debounce search for better performance
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
        performActualSearch(searchTerm, postCards, results);
    }, 150);
}

function performActualSearch(searchTerm, postCards, results) {
    postCards.forEach(card => {
        const titleElement = card.querySelector('h2');
        if (titleElement) {
            const title = titleElement.textContent;
            const titleLower = title.toLowerCase();
            const url = card.getAttribute('href');
            const content = card.querySelector('p')?.textContent || '';
            const contentLower = content.toLowerCase();
            const metaText = card.querySelector('.post-meta')?.textContent?.toLowerCase() || '';
            
            let score = 0;
            let matchType = '';
            let highlightTitle = title;
            let highlightContent = content.substring(0, 120) + (content.length > 120 ? '...' : '');
            
            // Advanced scoring system
            if (titleLower === searchTerm) {
                score = 100;
                matchType = 'exact';
                highlightTitle = highlightSearchTerm(title, searchTerm);
            }
            else if (titleLower.startsWith(searchTerm)) {
                score = 95;
                matchType = 'title-start';
                highlightTitle = highlightSearchTerm(title, searchTerm);
            }
            else if (titleLower.includes(searchTerm)) {
                score = 85;
                matchType = 'title-match';
                highlightTitle = highlightSearchTerm(title, searchTerm);
            }
            else if (contentLower.includes(searchTerm)) {
                score = 70;
                matchType = 'content-match';
                highlightContent = highlightSearchTerm(highlightContent, searchTerm);
            }
            else if (metaText.includes(searchTerm)) {
                score = 65;
                matchType = 'meta-match';
            }
            else {
                // Enhanced fuzzy matching
                const titleWords = titleLower.split(/\s+/);
                const contentWords = contentLower.split(/\s+/).slice(0, 20); // Limit for performance
                const searchWords = searchTerm.split(/\s+/);
                
                let titleScore = calculateWordMatches(titleWords, searchWords) * 20;
                let contentScore = calculateWordMatches(contentWords, searchWords) * 10;
                
                // Semantic similarity (partial matches)
                titleScore += calculatePartialMatches(titleLower, searchTerm) * 15;
                contentScore += calculatePartialMatches(contentLower, searchTerm) * 8;
                
                score = titleScore + contentScore;
                
                if (score > 30) {
                    matchType = 'semantic';
                    if (titleScore > contentScore) {
                        highlightTitle = highlightPartialMatches(title, searchTerm);
                    } else {
                        highlightContent = highlightPartialMatches(highlightContent, searchTerm);
                    }
                }
            }
            
            if (score > 0) {
                results.push({ 
                    title: highlightTitle, 
                    originalTitle: title,
                    url, 
                    content: highlightContent,
                    score: Math.round(score),
                    matchType
                });
            }
        }
    });
    
    // Sort results by score and relevance
    results.sort((a, b) => {
        if (b.score === a.score) {
            return a.originalTitle.length - b.originalTitle.length; // Prefer shorter titles
        }
        return b.score - a.score;
    });
    
    displaySearchResults(results, searchTerm);
}

// Enhanced word matching algorithm
function calculateWordMatches(words, searchWords) {
    let matches = 0;
    searchWords.forEach(searchWord => {
        words.forEach(word => {
            if (word.startsWith(searchWord) && searchWord.length > 2) {
                matches += searchWord.length / word.length;
            } else if (levenshteinDistance(word, searchWord) <= Math.max(1, Math.floor(searchWord.length * 0.2))) {
                matches += 0.7;
            }
        });
    });
    return matches;
}

// Calculate partial matches for semantic similarity
function calculatePartialMatches(text, searchTerm) {
    let score = 0;
    const searchLength = searchTerm.length;
    
    for (let i = 0; i <= text.length - searchLength; i++) {
        const substring = text.substring(i, i + searchLength);
        const similarity = 1 - (levenshteinDistance(substring, searchTerm) / searchLength);
        if (similarity > 0.7) {
            score += similarity;
        }
    }
    return score;
}

// Enhanced highlighting for partial matches
function highlightPartialMatches(text, term) {
    const words = term.split(/\s+/);
    let result = text;
    
    words.forEach(word => {
        if (word.length > 2) {
            const regex = new RegExp(`(${word})`, 'gi');
            result = result.replace(regex, '<mark style="background: rgba(77, 166, 255, 0.3); color: #4da6ff; padding: 0 2px; border-radius: 3px;">$1</mark>');
        }
    });
    
    return result;
}

// Highlight search terms in results
function highlightSearchTerm(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(77, 166, 255, 0.3); color: #4da6ff; padding: 0 2px; border-radius: 3px;">$1</mark>');
}

// Simple fuzzy matching
function fuzzyMatch(text, pattern) {
    const textLen = text.length;
    const patternLen = pattern.length;
    
    if (patternLen > textLen) return false;
    if (patternLen === textLen) return text === pattern;
    
    let textIndex = 0;
    let patternIndex = 0;
    let matches = 0;
    
    while (textIndex < textLen && patternIndex < patternLen) {
        if (text[textIndex] === pattern[patternIndex]) {
            matches++;
            patternIndex++;
        }
        textIndex++;
    }
    
    return matches / patternLen > 0.7;
}

// Levenshtein distance for typo tolerance
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

function displaySearchResults(results, searchTerm) {
    // Performance optimization: use DocumentFragment for better rendering
    const fragment = document.createDocumentFragment();
    
    if (results.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'search-result-item';
        noResultsDiv.style.setProperty('--result-index', '0');
        noResultsDiv.innerHTML = `
            <div style="padding: 1.5rem; color: #888; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem; animation: bounce 1s ease-in-out;">🔍</div>
                <div style="font-weight: 500; margin-bottom: 0.5rem;">No results found for "${searchTerm}"</div>
                <div style="font-size: 0.85rem; color: #666; margin-bottom: 1rem;">Try different keywords or check spelling</div>
                <div style="font-size: 0.8rem; color: #888;">
                    💡 <strong>Search tips:</strong> Use shorter terms, check for typos, or try synonyms
                </div>
            </div>
        `;
        fragment.appendChild(noResultsDiv);
    } else {
        const totalResults = results.length;
        
        // Results header with enhanced info
        const headerDiv = document.createElement('div');
        headerDiv.className = 'search-result-item';
        headerDiv.style.setProperty('--result-index', '0');
        headerDiv.style.cssText = 'padding: 0.75rem 1rem; border-bottom: 1px solid #404040; color: #4da6ff; font-size: 0.9rem; font-weight: 500; background: rgba(77, 166, 255, 0.05);';
        headerDiv.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="animation: pulse 2s infinite;">🎯</span>
                    <span>Found ${totalResults} result${totalResults > 1 ? 's' : ''} for "${searchTerm}"</span>
                </div>
                <div style="font-size: 0.8rem; opacity: 0.7;">
                    ${(performance.now() - window.searchStartTime || 0).toFixed(0)}ms
                </div>
            </div>
        `;
        fragment.appendChild(headerDiv);
        
        // Display top results with enhanced UI
        results.slice(0, 8).forEach((post, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'search-result-item';
            resultDiv.style.setProperty('--result-index', index + 1);
            resultDiv.style.cursor = 'pointer';
            resultDiv.onclick = () => navigateToPost(post.url);
            
            const matchTypeColor = getMatchTypeColor(post.matchType);
            const scoreBar = post.score > 80 ? '🔥' : post.score > 60 ? '⭐' : '💡';
            
            resultDiv.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
                        <div style="background: ${matchTypeColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; white-space: nowrap;">
                            ${post.matchType}
                        </div>
                        <div style="font-size: 0.8rem;">${scoreBar}</div>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h3 style="margin: 0 0 0.5rem 0; font-size: 1rem; line-height: 1.3; word-wrap: break-word;">${post.title}</h3>
                        <p style="margin: 0; font-size: 0.85rem; line-height: 1.4; opacity: 0.8; word-wrap: break-word;">${post.content}</p>
                        ${post.score ? `<div style="font-size: 0.7rem; color: #666; margin-top: 0.25rem;">Relevance: ${post.score}%</div>` : ''}
                    </div>
                </div>
            `;
            fragment.appendChild(resultDiv);
        });
        
        // Show "more results" indicator
        if (totalResults > 8) {
            const moreDiv = document.createElement('div');
            moreDiv.className = 'search-result-item';
            moreDiv.style.setProperty('--result-index', '9');
            moreDiv.style.cssText = 'padding: 0.75rem 1rem; color: #888; font-size: 0.85rem; text-align: center; border-top: 1px solid #404040; background: rgba(77, 166, 255, 0.02);';
            moreDiv.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span>📋</span>
                    <span>And ${totalResults - 8} more results... <em>Refine your search for better results</em></span>
                </div>
            `;
            fragment.appendChild(moreDiv);
        }
    }
    
    // Clear and append new results
    searchResults.innerHTML = '';
    searchResults.appendChild(fragment);
    showSearchResults();
}

function getMatchTypeColor(matchType) {
    const colors = {
        'exact': '#4da6ff',
        'title-start': '#00d4aa',
        'title-match': '#ffa726',
        'content-match': '#ab47bc',
        'meta-match': '#66bb6a',
        'semantic': '#ff7043',
        'fuzzy': '#78909c'
    };
    return colors[matchType] || '#666';
}

function navigateToPost(url) {
    clearSearch();
    window.location.href = url;
}

// Force clear search results completely
function forceClearSearchResults() {
    if (searchResults) {
        searchResults.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;';
        searchResults.innerHTML = '';
        // Force a reflow
        searchResults.offsetHeight;
    }
}

function hideSearchResults() {
    if (searchResults) {
        searchResults.style.display = 'none';
        searchResults.style.visibility = 'hidden';
        searchResults.style.opacity = '0';
        searchResults.style.pointerEvents = 'none';
        // Clear the content to ensure no results remain
        searchResults.innerHTML = '';
        // Force a reflow to ensure the hiding takes effect
        searchResults.offsetHeight;
    } else {
        console.error('Search results element not found!');
    }
}

function clearSearch() {
    if (searchInput) {
        searchInput.value = '';
        forceClearSearchResults();
        searchInput.blur();
    }
}

function showSearchResults() {
    if (searchResults) {
        searchResults.style.display = 'block';
        searchResults.style.visibility = 'visible';
        searchResults.style.opacity = '1';
        searchResults.style.pointerEvents = 'auto';
    } else {
        console.error('Search results element not found!');
    }
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

// Handle search input clearing
function handleSearchInputChange(value) {
    // Clear any existing timeout
    clearTimeout(window.searchInputTimeout);
    
    if (value && value.trim()) {
        // Small delay to ensure smooth typing
        window.searchInputTimeout = setTimeout(() => {
            performSearch(value);
        }, 100);
    } else {
        // Immediately hide results when text is empty
        hideSearchResults();
    }
}

// Event listeners
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value && value.trim()) {
            handleSearchInputChange(value);
        } else {
            // Force clear results when input is empty
            forceClearSearchResults();
        }
    });

    searchInput.addEventListener('change', (e) => {
        // Handle change events (when input loses focus)
        const value = e.target.value;
        if (!value || !value.trim()) {
            forceClearSearchResults();
        }
    });

    searchInput.addEventListener('focus', () => {
        // Show results if there's text in the input
        if (searchInput.value.trim()) {
            performSearch(searchInput.value);
        }
    });

    searchInput.addEventListener('click', () => {
        // Show results if there's text in the input when clicked
        if (searchInput.value.trim()) {
            performSearch(searchInput.value);
        }
    });

    searchInput.addEventListener('paste', (e) => {
        // Handle paste events
        setTimeout(() => {
            const value = searchInput.value;
            if (value && value.trim()) {
                handleSearchInputChange(value);
            } else {
                forceClearSearchResults();
            }
        }, 10);
    });

    // Handle when user clears the input
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            // If clearing the last character, force clear results
            if (searchInput.value.length <= 1) {
                forceClearSearchResults();
            }
        }
    });
} else {
    console.error('Search input element not found!');
}

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
    // Ensure search results are hidden on page load
    if (searchResults) {
        forceClearSearchResults();
    }
    
    if (searchInput && searchResults) {
        // Reset search input value
        searchInput.value = '';
    } else {
        console.error('Search elements not found on DOM ready');
    }
    
    initializeShareButtons();
    animateCards();
    // Removed initializeMouseTracking() - now handled by tilt-effect.js
    
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

// Animate cards with staggered timing
function animateCards() {
    const cards = document.querySelectorAll('.post-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-delay', `${index * 0.1}s`);
    });
}



// Disable right-click, keyboard shortcuts, and browser inspection
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert('Right-click is disabled to protect the content.');
});

// Disable keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
        e.preventDefault();
        alert('This action is disabled to protect the content.');
    }
});

// Prevent opening developer tools
(function() {
    // Prevent opening developer tools
    const devtools = /./;
    devtools.toString = function() {
        this.opened = true;
    }
    console.log('%c', devtools);
    devtools.opened = false;

    setInterval(function() {
        if (devtools.opened) {
            alert('Developer tools are disabled to protect the content.');
            window.location.reload();
        }
    }, 1000);
})();

// Prevent taking screenshots
document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled to protect the content.');
    }
});

// Prevent drag and drop
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// Prevent text selection
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// Prevent image dragging
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable', 'false');
});