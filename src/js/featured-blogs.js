document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('src/pages/footer-pages/blog-index.json');
    const blogs = await res.json();
    const featured = blogs.filter(blog => blog.featured).slice(0, 3);
    const container = document.getElementById('featured-blogs');
    if (!container) return;
    if (featured.length === 0) {
        container.innerHTML = '<p>No featured blog posts yet.</p>';
        return;
    }
    container.innerHTML = featured.map(blog => `
        <article class="blog-card-small">
            <div class="blog-card-small-img">
                <img src="${blog.cover || 'src/assets/images/placeholders/blog-placeholder.svg'}" alt="${blog.title}">
            </div>
            <div class="blog-card-small-content">
                <h3 class="blog-card-small-title">
                    <a href="src/pages/footer-pages/post.html?slug=${blog.slug}">${blog.title}</a>
                </h3>
                <div class="blog-card-small-meta">
                    <span><i class="far fa-calendar"></i> ${blog.date}</span>
                    <span><i class="far fa-folder"></i> ${(blog.tags && blog.tags[0]) || ''}</span>
                </div>
                <p class="blog-card-small-excerpt">${blog.summary || ''}</p>
                <a href="src/pages/footer-pages/post.html?slug=${blog.slug}" class="link link-underline blog-card-small-link">Read More</a>
            </div>
        </article>
    `).join('');
}); 