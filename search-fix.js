// Simple, reliable search implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('Search fix script loaded');
    
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        console.error('Search elements not found');
        return;
    }
    
    console.log('Search elements found:', searchInput, searchResults);
    
    // Ensure clicking anywhere in the search container focuses the input
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.addEventListener('click', function(e) {
            if (e.target !== searchInput) {
                searchInput.focus();
            }
        });
    }
    
    // Simple search function
    function searchPosts(query) {
        if (!query || query.trim() === '') {
            hideResults();
            return;
        }
        
        const postCards = document.querySelectorAll('.post-card');
        const results = [];
        
        postCards.forEach(card => {
            const title = card.querySelector('h2')?.textContent || '';
            const content = card.querySelector('p')?.textContent || '';
            const searchTerm = query.toLowerCase();
            
            if (title.toLowerCase().includes(searchTerm) || content.toLowerCase().includes(searchTerm)) {
                results.push({
                    title: title,
                    content: content,
                    url: card.getAttribute('href')
                });
            }
        });
        
        displayResults(results);
    }
    
    function displayResults(results) {
        console.log('Displaying results:', results);
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 15px; color: #888;">No results found</div>';
        } else {
            searchResults.innerHTML = results.map(result => 
                `<div style="padding: 15px; border-bottom: 1px solid #333; cursor: pointer;" onclick="window.location.href='${result.url}'">
                    <h3 style="margin: 0 0 5px 0; color: #fff;">${result.title}</h3>
                    <p style="margin: 0; color: #ccc; font-size: 14px;">${result.content.substring(0, 100)}...</p>
                </div>`
            ).join('');
        }
        
        showResults();
    }
    
    function showResults() {
        searchResults.style.display = 'block';
        searchResults.style.visibility = 'visible';
        searchResults.style.opacity = '1';
    }
    
    function hideResults() {
        searchResults.style.display = 'none';
        searchResults.style.visibility = 'hidden';
        searchResults.style.opacity = '0';
    }
    
    // Event listeners
    searchInput.addEventListener('input', function(e) {
        console.log('Input event:', e.target.value);
        searchPosts(e.target.value);
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            hideResults();
        }
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideResults();
            searchInput.blur();
        }
    });
    
    console.log('Search functionality initialized');
});
