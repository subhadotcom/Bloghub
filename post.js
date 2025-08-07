// Utility: parse query string
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Simple markdown to HTML converter (reuse from editor.js)
function markdownToHtml(md) {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*)\*/gim, '<i>$1</i>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, '<br />');
}

const postId = getQueryParam('id');
const posts = JSON.parse(localStorage.getItem('posts') || '[]');
const post = posts.find(p => String(p.id) === String(postId));
const container = document.getElementById('post-content-container');

if (post) {
  container.innerHTML = `
    <h2>${post.title}</h2>
    <div class="post-meta">${post.date}</div>
    <div class="post-body">${markdownToHtml(post.content)}</div>
  `;
} else {
  container.innerHTML = '<p>Post not found.</p>';
}

// Social sharing
const shareSection = document.getElementById('social-share');
if (post) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(post.title);
  shareSection.innerHTML = `
    <button onclick="window.open('https://twitter.com/intent/tweet?url=${url}&text=${text}','_blank')">Twitter</button>
    <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${url}','_blank')">Facebook</button>
    <button onclick="window.open('https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}','_blank')">LinkedIn</button>
  `;
}

// Comments
const commentsKey = `comments_${postId}`;
function loadComments() {
  const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
  const list = document.getElementById('comments-list');
  list.innerHTML = '';
  comments.forEach(c => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
      <span class="comment-author">${c.author}</span>
      <span class="comment-date">${c.date}</span>
      <div class="comment-text">${c.text}</div>
    `;
    list.appendChild(div);
  });
}

document.getElementById('comment-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const author = document.getElementById('comment-author').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  if (!author || !text) return;
  const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
  comments.push({ author, text, date: new Date().toLocaleString() });
  localStorage.setItem(commentsKey, JSON.stringify(comments));
  this.reset();
  loadComments();
});

loadComments(); 