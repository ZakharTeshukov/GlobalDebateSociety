document.addEventListener('DOMContentLoaded', async () => {
    const blogs = await fetchBlogIndex();
    renderTags(blogs);
    renderBlogList(blogs);

    let currentTag = 'all';
    let currentSearch = '';

    document.getElementById('filter-tags').addEventListener('click', e => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentTag = e.target.getAttribute('data-tag');
            const filtered = filterBlogs(blogs, currentTag, currentSearch);
            renderBlogList(filtered);
        }
    });

    document.getElementById('search-btn').addEventListener('click', () => {
        currentSearch = document.getElementById('blog-search').value.toLowerCase().trim();
        const filtered = filterBlogs(blogs, currentTag, currentSearch);
        renderBlogList(filtered);
    });
    document.getElementById('blog-search').addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            currentSearch = document.getElementById('blog-search').value.toLowerCase().trim();
            const filtered = filterBlogs(blogs, currentTag, currentSearch);
            renderBlogList(filtered);
        }
    });

    // Newsletter form handling
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            
            // Basic email validation
            const email = emailInput.value.trim();
            if (!isValidEmail(email)) {
                showSubscribeMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                showSubscribeMessage('Thanks for subscribing to our newsletter!', 'success');
                
                // Reset form
                newsletterForm.reset();
                
            } catch (error) {
                // Show error message
                showSubscribeMessage('An error occurred. Please try again.', 'error');
                
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Helper function to show newsletter subscription messages
    const showSubscribeMessage = (message, type) => {
        const newsletterContainer = document.querySelector('.newsletter-content');
        
        // Remove any existing messages
        const existingMessage = newsletterContainer.querySelector('.subscribe-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `subscribe-message ${type}`;
        messageElement.textContent = message;
        
        // Add message to DOM
        newsletterContainer.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 5000);
    };
    
    // Helper function to validate email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    
    // Add CSS for subscribe messages
    const addDynamicStyles = () => {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .subscribe-message {
                margin-top: 1rem;
                padding: 0.8rem;
                border-radius: 5px;
                text-align: center;
                animation: fadeIn 0.3s ease;
            }
            
            .subscribe-message.success {
                background-color: rgba(46, 204, 113, 0.2);
                color: #27ae60;
            }
            
            .subscribe-message.error {
                background-color: rgba(231, 76, 60, 0.2);
                color: #e74c3c;
            }
            
            .search-results-message {
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
                color: #666;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .clear-search {
                background-color: var(--secondary-color);
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
                margin-left: 1rem;
            }
            
            .clear-search:hover {
                background-color: var(--primary-color);
            }
            
            .fade-out {
                animation: fadeOut 0.5s ease;
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(styleElement);
    };
    
    // Add dynamic styles
    addDynamicStyles();
});

// Blog Database Dynamic Rendering
async function fetchBlogIndex() {
    const res = await fetch('blog-index.json');
    return res.json();
}

function renderTags(blogs) {
    const tagSet = new Set();
    blogs.forEach(blog => {
        if (Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => tagSet.add(tag));
        }
    });
    const tags = Array.from(tagSet).sort();
    const filterTags = document.getElementById('filter-tags');
    filterTags.innerHTML = '<button class="filter-btn active" data-tag="all">All</button>' +
        tags.map(tag => `<button class="filter-btn" data-tag="${tag}">${tag}</button>`).join('');
}

function renderBlogList(blogs) {
    const blogList = document.getElementById('blog-list');
    if (!blogList) return;
    if (blogs.length === 0) {
        blogList.innerHTML = '<p>No blog posts found.</p>';
        return;
    }
    blogList.innerHTML = blogs.map(blog => `
        <article class="blog-card" data-category="${(blog.tags && blog.tags[0]) || ''}">
            <div class="blog-card-image">
                <img src="${blog.cover || '../../assets/images/placeholders/blog-placeholder.svg'}" alt="${blog.title}">
            </div>
            <div class="blog-card-content">
                <div class="post-meta">
                    <span class="category">${(blog.tags && blog.tags[0]) || ''}</span>
                    <span class="date">${blog.date}</span>
                </div>
                <h3>${blog.title}</h3>
                <p>${blog.summary || ''}</p>
                <a href="post.html?slug=${blog.slug}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `).join('');
}

function filterBlogs(blogs, tag, searchTerm) {
    return blogs.filter(blog => {
        const matchesTag = tag === 'all' || (blog.tags && blog.tags.includes(tag));
        const matchesSearch = !searchTerm ||
            blog.title.toLowerCase().includes(searchTerm) ||
            (blog.summary && blog.summary.toLowerCase().includes(searchTerm)) ||
            (blog.tags && blog.tags.some(t => t.toLowerCase().includes(searchTerm)));
        return matchesTag && matchesSearch;
    });
} 