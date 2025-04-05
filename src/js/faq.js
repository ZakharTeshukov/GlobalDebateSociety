document.addEventListener('DOMContentLoaded', () => {
    // Handle accordion functionality
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Add click event to all accordion headers
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Check if this item is already active
            const isActive = item.classList.contains('active');
            
            // Close all accordions first (optional - for single open accordion)
            accordionItems.forEach(accordionItem => {
                accordionItem.classList.remove('active');
            });
            
            // Toggle active class on the clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Handle category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the category to filter by
            const category = button.getAttribute('data-category');
            
            // Filter items
            accordionItems.forEach(item => {
                // First remove all active classes when changing categories
                item.classList.remove('active');
                
                // If 'all' is selected or the item matches the category, show it
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Open accordion item if it's targeted by URL hash
    const openAccordionFromHash = () => {
        const hash = window.location.hash.substring(1); // Remove the # character
        
        if (hash) {
            // Look for an accordion item with matching id or data attribute
            const targetItem = document.getElementById(hash) || 
                              document.querySelector(`[data-hash="${hash}"]`) ||
                              document.querySelector(`[data-category="${hash}"]`);
            
            if (targetItem && targetItem.classList.contains('accordion-item')) {
                // Close all accordions
                accordionItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open the target accordion
                targetItem.classList.add('active');
                
                // Scroll to it
                targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Activate the corresponding category
                const itemCategory = targetItem.getAttribute('data-category');
                if (itemCategory) {
                    categoryButtons.forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.getAttribute('data-category') === itemCategory) {
                            btn.classList.add('active');
                            btn.click(); // Trigger click to filter
                        }
                    });
                }
            }
        }
    };
    
    // Run on page load
    openAccordionFromHash();
    
    // Run when hash changes
    window.addEventListener('hashchange', openAccordionFromHash);
    
    // Add search functionality
    const searchFaq = (searchTerm) => {
        // Show all categories
        document.querySelector('.category-btn[data-category="all"]').click();
        
        if (!searchTerm.trim()) {
            return;
        }
        
        searchTerm = searchTerm.toLowerCase();
        let hasResults = false;
        
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header h3').textContent.toLowerCase();
            const content = item.querySelector('.accordion-content').textContent.toLowerCase();
            
            if (header.includes(searchTerm) || content.includes(searchTerm)) {
                item.style.display = 'block';
                item.classList.add('search-highlight');
                hasResults = true;
            } else {
                item.style.display = 'none';
                item.classList.remove('search-highlight');
            }
        });
        
        // Expand all search results
        if (hasResults) {
            document.querySelectorAll('.accordion-item.search-highlight').forEach(item => {
                item.classList.add('active');
            });
        }
    };
    
    // Handle adding search box via JavaScript
    const addSearchBox = () => {
        const categoriesContainer = document.querySelector('.faq-categories');
        
        // Create search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'faq-search';
        
        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search questions...';
        searchInput.className = 'search-input';
        
        // Create search button
        const searchButton = document.createElement('button');
        searchButton.type = 'button';
        searchButton.className = 'search-button';
        searchButton.innerHTML = '<i class="fas fa-search"></i>';
        
        // Add event listener to search button
        searchButton.addEventListener('click', () => {
            searchFaq(searchInput.value);
        });
        
        // Add event listener for Enter key
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchFaq(searchInput.value);
            }
            
            // Clear highlights if search box is emptied
            if (searchInput.value.trim() === '') {
                document.querySelectorAll('.accordion-item').forEach(item => {
                    item.classList.remove('search-highlight');
                });
                document.querySelector('.category-btn[data-category="all"]').click();
            }
        });
        
        // Append elements to search container
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchButton);
        
        // Insert the search box before the categories
        categoriesContainer.parentNode.insertBefore(searchContainer, categoriesContainer);
    };
    
    // Add search box to the page
    addSearchBox();
}); 