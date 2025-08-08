document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let posts = [];
    let searchTimeout;

    // Fetch all posts from the page
    function fetchPosts() {
        const postCards = document.querySelectorAll('.post-card');
        posts = Array.from(postCards).map(card => ({
            title: card.querySelector('h2').textContent.trim(),
            excerpt: card.querySelector('p').textContent.trim(),
            url: card.getAttribute('href'),
            element: card
        }));
    }

    // Debounce search function
    function debounceSearch(query) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchPosts(query);
        }, 200);
    }

    // Search function
    function searchPosts(query) {
        const searchTerm = query.trim().toLowerCase();
        
        if (!searchTerm) {
            hideResults();
            return;
        }

        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm)
        );

        displayResults(filteredPosts);
    }

    // Display search results with animation
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No stories found';
            searchResults.appendChild(noResults);
        } else {
            results.slice(0, 5).forEach((post, index) => {
                const resultItem = document.createElement('a');
                resultItem.href = post.url;
                resultItem.className = 'search-result';
                resultItem.style.animationDelay = `${index * 50}ms`;
                resultItem.innerHTML = `
                    <div class="search-result-item">
                        <div class="search-result-title">${highlightMatches(post.title, searchInput.value.trim())}</div>
                        <div class="search-result-excerpt">${highlightMatches(post.excerpt, searchInput.value.trim())}</div>
                    </div>
                `;
                searchResults.appendChild(resultItem);
            });
        }
        
        showResults();
    }

    // Highlight matching text in search results
    function highlightMatches(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    // Show results with animation
    function showResults() {
        searchResults.classList.add('visible');
        document.addEventListener('click', handleClickOutside);
    }

    // Hide results with animation
    function hideResults() {
        searchResults.classList.remove('visible');
        document.removeEventListener('click', handleClickOutside);
    }

    // Handle click outside search container
    function handleClickOutside(e) {
        if (!e.target.closest('.search-container')) {
            hideResults();
        }
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        debounceSearch(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() !== '') {
            searchPosts(searchInput.value.trim());
        }
    });

    // Close search results when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideResults();
        }
    });

    // Initialize
    fetchPosts();
});
