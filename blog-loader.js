// Blog post loader and Markdown parser

class BlogLoader {
    constructor() {
        this.posts = [];
        this.postsContainer = document.querySelector('.blog-posts-grid');
        this.noPostsElement = document.getElementById('no-posts');
        this.currentFilter = 'all';
        
        // List of post files (you can update this list when you add new posts)
        this.postFiles = [
            '2024-08-15-vision-valley-adventure.md',
            '2024-09-20-stage-crew-life.md',
            '2024-11-10-rowing-season-reflections.md'
        ];
    }

    async init() {
        await this.loadAllPosts();
        this.renderPosts();
        this.setupFilters();
    }

    async loadAllPosts() {
        console.log('Loading blog posts...');
        
        for (const filename of this.postFiles) {
            try {
                const response = await fetch(`_posts/${filename}`);
                if (response.ok) {
                    const content = await response.text();
                    const post = this.parseMarkdownPost(content, filename);
                    if (post) {
                        this.posts.push(post);
                    }
                } else {
                    console.warn(`Could not load post: ${filename}`);
                }
            } catch (error) {
                console.error(`Error loading post ${filename}:`, error);
            }
        }

        // Sort posts by date (newest first)
        this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log(`Loaded ${this.posts.length} posts`);
    }

    parseMarkdownPost(content, filename) {
        try {
            // Split front matter and content
            const parts = content.split('---');
            if (parts.length < 3) {
                console.warn(`Invalid front matter in ${filename}`);
                return null;
            }

            const frontMatter = parts[1];
            const markdownContent = parts.slice(2).join('---').trim();

            // Parse front matter
            const post = {
                filename: filename,
                slug: filename.replace('.md', ''),
                content: markdownContent
            };

            // Parse front matter lines
            frontMatter.split('\n').forEach(line => {
                line = line.trim();
                if (line && line.includes(':')) {
                    const [key, ...valueParts] = line.split(':');
                    const value = valueParts.join(':').trim();
                    
                    // Remove quotes if present
                    const cleanValue = value.replace(/^["']|["']$/g, '');
                    
                    // Special handling for arrays
                    if (key.trim() === 'tags' && cleanValue.startsWith('[')) {
                        post[key.trim()] = cleanValue
                            .replace(/[\[\]]/g, '')
                            .split(',')
                            .map(tag => tag.trim());
                    } else {
                        post[key.trim()] = cleanValue;
                    }
                }
            });

            // Generate excerpt if not provided
            if (!post.excerpt) {
                const firstParagraph = markdownContent.split('\n\n')[0];
                post.excerpt = this.stripMarkdown(firstParagraph).substring(0, 200) + '...';
            }

            // Generate read time estimate
            const wordCount = markdownContent.split(/\s+/).length;
            post.readTime = Math.ceil(wordCount / 200); // Average reading speed

            return post;
        } catch (error) {
            console.error(`Error parsing post ${filename}:`, error);
            return null;
        }
    }

    stripMarkdown(text) {
        return text
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italic
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
            .replace(/`([^`]+)`/g, '$1') // Remove inline code
            .trim();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getCategoryClass(category) {
        const categoryMap = {
            'adventure': 'adventure',
            'sports': 'sports',
            'personal': 'personal',
            'technology': 'technology'
        };
        return categoryMap[category] || 'personal';
    }

    createPostHTML(post) {
        const categoryClass = this.getCategoryClass(post.category);
        const formattedDate = this.formatDate(post.date);
        const postUrl = `blog-${post.slug}.html`;
        
        // Use featured_image or fallback to placeholder
        const imageUrl = post.featured_image || `https://via.placeholder.com/400x250/4a90e2/ffffff?text=${encodeURIComponent(post.title)}`;
        
        const tags = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';

        return `
            <article class="blog-post" data-category="${post.category}">
                <div class="post-image">
                    <img src="${imageUrl}" alt="${post.title}" onerror="this.src='https://via.placeholder.com/400x250/4a90e2/ffffff?text=${encodeURIComponent(post.title)}'">
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-category ${categoryClass}">${post.category}</span>
                        <span class="post-date">${formattedDate}</span>
                        <span class="read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime} min read
                        </span>
                    </div>
                    <h3 class="post-title">
                        <a href="${postUrl}">${post.title}</a>
                    </h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-tags">
                        ${tags}
                    </div>
                    <a href="${postUrl}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    }

    renderPosts(filterCategory = 'all') {
        if (!this.postsContainer) return;

        let filteredPosts = this.posts;
        
        if (filterCategory !== 'all') {
            filteredPosts = this.posts.filter(post => post.category === filterCategory);
        }

        if (filteredPosts.length === 0) {
            this.postsContainer.style.display = 'none';
            if (this.noPostsElement) {
                this.noPostsElement.style.display = 'block';
            }
            return;
        }

        this.postsContainer.style.display = 'grid';
        if (this.noPostsElement) {
            this.noPostsElement.style.display = 'none';
        }

        const postsHTML = filteredPosts.map(post => this.createPostHTML(post)).join('');
        this.postsContainer.innerHTML = postsHTML;

        console.log(`Rendered ${filteredPosts.length} posts for category: ${filterCategory}`);
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Get filter category
                const filterCategory = e.target.getAttribute('data-filter');
                this.currentFilter = filterCategory;
                
                // Render filtered posts
                this.renderPosts(filterCategory);
            });
        });
    }

    // Method to get post data for individual post pages
    getPostBySlug(slug) {
        return this.posts.find(post => post.slug === slug);
    }

    // Method to get recent posts for sidebar/footer
    getRecentPosts(limit = 3) {
        return this.posts.slice(0, limit);
    }
}

// Initialize blog loader when page loads
document.addEventListener('DOMContentLoaded', async function() {
    if (document.querySelector('.blog-posts-grid')) {
        window.blogLoader = new BlogLoader();
        await window.blogLoader.init();
    }
});

// Export for use in other scripts
window.BlogLoader = BlogLoader;
