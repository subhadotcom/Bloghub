// Simple markdown to HTML converter (basic)
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

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const contentInput = document.getElementById('post-content');
const preview = document.getElementById('markdown-preview');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
let uploadedImage = '';

const postId = getQueryParam('id');
if (postId) {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find(p => String(p.id) === String(postId));
  if (post) {
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-content').value = post.content;
    document.getElementById('markdown-preview').innerHTML = markdownToHtml(post.content);
  }
}

contentInput.addEventListener('input', () => {
  preview.innerHTML = markdownToHtml(contentInput.value);
});

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    uploadedImage = evt.target.result;
    imagePreview.innerHTML = `<img src="${uploadedImage}" style="max-width:200px;max-height:200px;" />`;
    // Insert markdown image tag at cursor
    const cursorPos = contentInput.selectionStart;
    const before = contentInput.value.substring(0, cursorPos);
    const after = contentInput.value.substring(cursorPos);
    contentInput.value = before + `![]( ${uploadedImage} )` + after;
    contentInput.dispatchEvent(new Event('input'));
  };
  reader.readAsDataURL(file);
});

document.getElementById('post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('post-title').value.trim();
  const content = contentInput.value.trim();
  const date = new Date().toISOString().slice(0, 10);
  let posts = JSON.parse(localStorage.getItem('posts') || '[]');
  if (postId) {
    posts = posts.map(p => String(p.id) === String(postId) ? { ...p, title, content, date } : p);
  } else {
    posts.unshift({ id: Date.now(), title, content, date });
  }
  localStorage.setItem('posts', JSON.stringify(posts));
  window.location.href = 'index.html';
}); 