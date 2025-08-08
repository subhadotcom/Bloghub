const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const posts = document.querySelectorAll('.post-card');

        // Create an array of post data
        const postData = Array.from(posts).map(post => ({
            title: post.querySelector('h2').textContent,
            content: post.querySelector('p').textContent,
            link: post.getAttribute('href')
        }));

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            const matches = postData.filter(post =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm)
            );

            if (matches.length > 0) {
                searchResults.innerHTML = matches.map(post => `
                    <div class="search-result-item" onclick="window.location.href='${post.link}'">
                        <h3>${highlightMatch(post.title, searchTerm)}</h3>
                        <p>${truncateAndHighlight(post.content, searchTerm)}</p>
                    </div>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                searchResults.style.display = 'block';
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchResults.contains(e.target) && e.target !== searchInput) {
                searchResults.style.display = 'none';
            }
        });

        function highlightMatch(text, searchTerm) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }

        function truncateAndHighlight(text, searchTerm, maxLength = 100) {
            let truncated = text.length > maxLength ? 
                text.substr(0, maxLength) + '...' : 
                text;
            return highlightMatch(truncated, searchTerm);
        }