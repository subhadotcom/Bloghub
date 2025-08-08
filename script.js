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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Search initialized');
});