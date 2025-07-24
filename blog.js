// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality for blog posts
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogPosts = document.querySelectorAll('.blog-post[data-category]');
    const categoryCards = document.querySelectorAll('.category-card');

    // Filter posts based on category
    function filterPosts(category) {
        let visibleCount = 0;
        
        blogPosts.forEach(post => {
            if (category === 'all' || post.dataset.category === category) {
                post.style.display = 'block';
                post.classList.add('fade-in');
                visibleCount++;
            } else {
                post.style.display = 'none';
                post.classList.remove('fade-in');
            }
        });
        
        // Show/hide empty state
        const noPostsElement = document.getElementById('no-posts');
        if (noPostsElement) {
            if (visibleCount === 0) {
                noPostsElement.style.display = 'block';
            } else {
                noPostsElement.style.display = 'none';
            }
        }
    }

    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter posts
            const category = this.dataset.filter;
            filterPosts(category);
        });
    });

    // Handle category card clicks
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.filter;
            
            // Update filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            const targetButton = document.querySelector(`[data-filter="${category}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }
            
            // Filter posts
            filterPosts(category);
            
            // Scroll to posts section
            document.querySelector('.blog-posts-section').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple validation
            if (email && email.includes('@')) {
                alert('Thank you for subscribing! You\'ll receive notifications when I publish new posts.');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Comment form submission
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('#comment-name').value;
            const email = this.querySelector('#comment-email').value;
            const message = this.querySelector('#comment-message').value;
            
            if (name && email && message) {
                alert('Thank you for your comment! I\'ll review it and get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList[1]; // Gets the second class (facebook, twitter, etc.)
            const url = window.location.href;
            const title = document.querySelector('.post-title')?.textContent || document.title;
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
                case 'copy-link':
                    // Copy to clipboard
                    navigator.clipboard.writeText(url).then(() => {
                        // Show temporary feedback
                        const originalText = this.innerHTML;
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            this.innerHTML = originalText;
                        }, 2000);
                    }).catch(() => {
                        // Fallback for older browsers
                        prompt('Copy this link:', url);
                    });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });

    // Read time calculation for blog posts
    function calculateReadTime() {
        const postBody = document.querySelector('.post-body');
        if (postBody) {
            const text = postBody.textContent;
            const wordsPerMinute = 200;
            const wordCount = text.trim().split(/\s+/).length;
            const readTime = Math.ceil(wordCount / wordsPerMinute);
            
            const readTimeElement = document.querySelector('.read-time');
            if (readTimeElement) {
                readTimeElement.innerHTML = `<i class="fas fa-clock"></i> ${readTime} min read`;
            }
        }
    }

    // Calculate read time on individual blog post pages
    calculateReadTime();

    // Smooth scrolling for anchor links within blog posts
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Back to top functionality for long blog posts
    function addBackToTop() {
        if (document.querySelector('.post-body')) {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.className = 'back-to-top';
            backToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(45deg, #2563eb, #667eea);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1000;
                font-size: 1.2rem;
            `;
            
            document.body.appendChild(backToTopBtn);
            
            // Show/hide based on scroll position
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.style.opacity = '1';
                } else {
                    backToTopBtn.style.opacity = '0';
                }
            });
            
            // Scroll to top when clicked
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    addBackToTop();

    // Search functionality (basic)
    function addSearchFunctionality() {
        const searchContainer = document.querySelector('.section-header');
        if (searchContainer && !document.querySelector('.blog-search')) {
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search posts...';
            searchInput.className = 'blog-search';
            searchInput.style.cssText = `
                padding: 0.5rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                margin-left: 1rem;
                width: 200px;
            `;
            
            searchContainer.appendChild(searchInput);
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                blogPosts.forEach(post => {
                    const title = post.querySelector('h3').textContent.toLowerCase();
                    const content = post.querySelector('p').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || content.includes(searchTerm)) {
                        post.style.display = 'block';
                    } else {
                        post.style.display = 'none';
                    }
                });
            });
        }
    }

    addSearchFunctionality();

    // Initialize animations
    setTimeout(() => {
        const elements = document.querySelectorAll('.blog-post, .category-card, .newsletter-card');
        elements.forEach(element => {
            element.classList.add('fade-in');
        });
    }, 100);
});
