document.addEventListener('DOMContentLoaded', () => {
    // Filter blog posts by category
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the category to filter by
            const category = button.getAttribute('data-category');
            
            // Filter blog cards
            blogCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'flex';
                    // Add animation class
                    card.classList.add('fade-in');
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        card.classList.remove('fade-in');
                    }, 500);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Handle blog search
    const searchInput = document.getElementById('blog-search');
    const searchButton = document.getElementById('search-btn');
    
    const searchBlog = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // If search term is empty, show all posts
        if (!searchTerm) {
            document.querySelector('.filter-btn[data-category="all"]').click();
            return;
        }
        
        // Reset filter buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Count visible cards for search results feedback
        let visibleCount = 0;
        
        // Filter blog cards based on search
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.category').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                card.style.display = 'flex';
                card.classList.add('fade-in');
                setTimeout(() => {
                    card.classList.remove('fade-in');
                }, 500);
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Add search results feedback
        updateSearchResults(visibleCount, searchTerm);
    };
    
    // Add search results message
    const updateSearchResults = (count, term) => {
        // Remove existing results message if any
        const existingMessage = document.querySelector('.search-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const resultsMessage = document.createElement('div');
        resultsMessage.className = 'search-results-message';
        
        // Set message text based on results count
        if (count > 0) {
            resultsMessage.textContent = `Found ${count} result${count > 1 ? 's' : ''} for "${term}"`;
        } else {
            resultsMessage.textContent = `No results found for "${term}"`;
            // Add a clear search button
            const clearButton = document.createElement('button');
            clearButton.className = 'clear-search';
            clearButton.textContent = 'Clear Search';
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                document.querySelector('.filter-btn[data-category="all"]').click();
                resultsMessage.remove();
            });
            resultsMessage.appendChild(clearButton);
        }
        
        // Insert message after search container
        const searchContainer = document.querySelector('.search-container');
        searchContainer.parentNode.insertBefore(resultsMessage, searchContainer.nextSibling);
    };
    
    // Add event listeners for search
    searchButton.addEventListener('click', searchBlog);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchBlog();
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