// DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');

// Function to get posts from the actual page
function getPostsFromPage() {
    const postCards = document.querySelectorAll('.post-card');
    const posts = [];
    
    postCards.forEach(card => {
        const titleElement = card.querySelector('h2');
        const contentElement = card.querySelector('p');
        const metaElement = card.querySelector('.post-meta');
        
        if (titleElement) {
            const title = titleElement.textContent.trim();
            const content = contentElement ? contentElement.textContent.trim() : '';
            const url = card.getAttribute('href') || '';
            
            // Extract date and author from meta
            let date = '';
            let author = '';
            if (metaElement) {
                const metaText = metaElement.textContent;
                const dateMatch = metaText.match(/([A-Za-z]+\s+\d{1,2},\s+\d{4})/);
                const authorMatch = metaText.match(/by\s+([^•]+)/);
                
                date = dateMatch ? dateMatch[1] : '';
                author = authorMatch ? authorMatch[1].trim() : '';
            }
            
            posts.push({
                title: title,
                content: content,
                author: author,
                date: date,
                url: url,
                element: card
            });
        }
    });
    
    return posts;
}

// Search functionality
function performSearch(query) {
    if (!query.trim()) {
        hideSearchResults();
        return;
    }

    const searchTerm = query.toLowerCase().trim();
    const blogPosts = getPostsFromPage();
    
    const results = blogPosts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm);
        return titleMatch; // Only search in titles (h2 elements)
    });

    displaySearchResults(results, searchTerm);
}

function displaySearchResults(results, searchTerm) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div style="padding: 1rem 1.25rem; color: #888; text-align: center;">
                    <div style="margin-bottom: 0.5rem;">🔍</div>
                    <div>No posts found for "${searchTerm}"</div>
                    <div style="font-size: 0.85rem; margin-top: 0.5rem;">Try different keywords</div>
                </div>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map((post, index) => `
            <div class="search-result-item" style="--delay: ${index * 0.05}s">
                <a href="${post.url}">
                    <div class="search-result-title">${highlightMatch(post.title, searchTerm)}</div>
                    <div style="color: #b0b0b0; font-size: 0.9rem; margin-bottom: 0.5rem;">
                        ${highlightMatch(post.content.substring(0, 80), searchTerm)}${post.content.length > 80 ? '...' : ''}
                    </div>
                    <div style="color: #777; font-size: 0.8rem;">
                        <span>${post.date}</span> • <span>by ${post.author}</span>
                    </div>
                </a>
            </div>
        `).join('');
    }
    
    showSearchResults();
}

function highlightMatch(text, searchTerm) {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(77, 166, 255, 0.3); color: #4da6ff; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

function showSearchResults() {
    searchResults.classList.add('visible');
}

function hideSearchResults() {
    searchResults.classList.remove('visible');
}

// Event listeners
searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    performSearch(query);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim()) {
        performSearch(searchInput.value);
    }
});

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query.trim()) {
        performSearch(query);
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchButton.contains(e.target) && !searchResults.contains(e.target)) {
        hideSearchResults();
    }
});

// Keyboard navigation
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideSearchResults();
        searchInput.blur();
    } else if (e.key === 'Enter') {
        const firstResult = searchResults.querySelector('a');
        if (firstResult) {
            firstResult.click();
        }
    }
});

// Debounce function to improve performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to search
const debouncedSearch = debounce(performSearch, 300);
searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Initialize search container
document.addEventListener('DOMContentLoaded', () => {
    // Add loading state
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim()) {
            searchButton.style.opacity = '0.7';
        } else {
            searchButton.style.opacity = '1';
        }
    });
});
