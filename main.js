// Sample posts data
const posts = [
  {
    id: 1,
    title: "Welcome to Bloghub!",
    date: "2024-06-01",
    excerpt: "This is your minimalist personal blog. Start writing your first post!",
    image: "",
  },
  {
    id: 2,
    title: "Markdown Support",
    date: "2024-06-02",
    excerpt: "Write posts using markdown and see them beautifully rendered.",
    image: "",
  },
  {
    id: 3,
    title: "Image Uploads",
    date: "2024-06-03",
    excerpt: "Add images to your posts with simple uploads.",
    image: "",
  },
];

function getPosts() {
  const stored = localStorage.getItem('posts');
  if (stored) return JSON.parse(stored);
  return posts;
}

function renderPosts() {
  const grid = document.getElementById('posts-grid');
  grid.innerHTML = '';
  getPosts().forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <h2 class="post-title">${post.title}</h2>
      <div class="post-meta">${post.date}</div>
      <p>${post.excerpt || (post.content ? post.content.slice(0, 120) + '...' : '')}</p>
      <a href="post.html?id=${post.id}" class="read-more">Read More</a>
      <div class="post-actions">
        <button class="edit-btn" data-id="${post.id}">Edit</button>
        <button class="delete-btn" data-id="${post.id}">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });
  // Add event listeners for edit/delete
  grid.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = `editor.html?id=${this.dataset.id}`;
    });
  });
  grid.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Delete this post?')) {
        let posts = getPosts();
        posts = posts.filter(p => String(p.id) !== String(this.dataset.id));
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', renderPosts); 