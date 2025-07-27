// Individual blog post page generator and loader

class BlogPostPage {
    constructor() {
        this.currentSlug = this.getSlugFromURL();
        this.post = null;
        this.markdownConverter = new SimpleMarkdownConverter();
    }

    getSlugFromURL() {
        const pathname = window.location.pathname;
        const filename = pathname.split('/').pop();
        
        // Extract slug from filename (e.g., "blog-2024-08-15-vision-valley-adventure.html")
        if (filename.startsWith('blog-') && filename.endsWith('.html')) {
            return filename.slice(5, -5); // Remove "blog-" prefix and ".html" suffix
        }
        return null;
    }

    async init() {
        if (!this.currentSlug) {
            console.error('No blog post slug found in URL');
            return;
        }

        try {
            await this.loadPost();
            if (this.post) {
                this.renderPost();
                this.updatePageMeta();
            } else {
                this.showNotFound();
            }
        } catch (error) {
            console.error('Error loading blog post:', error);
            this.showError();
        }
    }

    async loadPost() {
        // Try to load the corresponding markdown file
        const filename = `${this.currentSlug}.md`;
        
        try {
            const response = await fetch(`_posts/${filename}`);
            if (response.ok) {
                const content = await response.text();
                this.post = this.parseMarkdownPost(content, filename);
            } else {
                console.warn(`Could not load post file: ${filename}`);
            }
        } catch (error) {
            console.error(`Error fetching post ${filename}:`, error);
        }
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
                content: markdownContent,
                htmlContent: this.markdownConverter.toHTML(markdownContent)
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

            // Generate read time estimate
            const wordCount = markdownContent.split(/\s+/).length;
            post.readTime = Math.ceil(wordCount / 200);

            return post;
        } catch (error) {
            console.error(`Error parsing post ${filename}:`, error);
            return null;
        }
    }

    renderPost() {
        const postContainer = document.querySelector('.post-content-area, .blog-post-page');
        if (!postContainer) {
            console.error('Post container not found');
            return;
        }

        // Update post header
        this.updatePostHeader();
        
        // Update post content
        this.updatePostContent();
        
        // Update sidebar if it exists
        this.updateSidebar();
    }

    updatePostHeader() {
        const titleElement = document.querySelector('.post-title, h1');
        const subtitleElement = document.querySelector('.post-subtitle');
        const dateElement = document.querySelector('.post-date');
        const categoryElement = document.querySelector('.post-category');
        const readTimeElement = document.querySelector('.read-time');

        if (titleElement) titleElement.textContent = this.post.title || 'Untitled Post';
        if (subtitleElement) subtitleElement.textContent = this.post.subtitle || '';
        if (dateElement) {
            const formattedDate = this.formatDate(this.post.date);
            dateElement.innerHTML = `<i class="fas fa-calendar"></i> ${formattedDate}`;
        }
        if (categoryElement) {
            categoryElement.textContent = this.post.category || 'General';
            categoryElement.className = `post-category ${this.getCategoryClass(this.post.category)}`;
        }
        if (readTimeElement) {
            readTimeElement.innerHTML = `<i class="fas fa-clock"></i> ${this.post.readTime} min read`;
        }
    }

    updatePostContent() {
        const contentElement = document.querySelector('.post-body, .post-content-area .post-body');
        if (contentElement && this.post.htmlContent) {
            contentElement.innerHTML = this.post.htmlContent;
        }

        // Update featured image if it exists
        const featuredImageContainer = document.querySelector('.post-featured-image');
        if (featuredImageContainer && this.post.featured_image) {
            featuredImageContainer.innerHTML = `
                <img src="${this.post.featured_image}" alt="${this.post.title}" class="featured-image">
            `;
        }
    }

    updateSidebar() {
        // Update tags in sidebar if they exist
        const tagsContainer = document.querySelector('.post-tags-sidebar, .post-sidebar .tags');
        if (tagsContainer && this.post.tags) {
            const tagsHTML = this.post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            tagsContainer.innerHTML = tagsHTML;
        }
    }

    updatePageMeta() {
        // Update page title
        document.title = `${this.post.title} - Harrison Fluck`;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = this.post.excerpt || this.post.subtitle || `Read ${this.post.title} by Harrison Fluck`;
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

    showNotFound() {
        const container = document.querySelector('main') || document.body;
        container.innerHTML = `
            <div class="error-page">
                <div class="container">
                    <div class="error-content">
                        <h1>Post Not Found</h1>
                        <p>Sorry, the blog post you're looking for doesn't exist.</p>
                        <a href="blog.html" class="btn-primary">← Back to Blog</a>
                    </div>
                </div>
            </div>
        `;
    }

    showError() {
        const container = document.querySelector('main') || document.body;
        container.innerHTML = `
            <div class="error-page">
                <div class="container">
                    <div class="error-content">
                        <h1>Error Loading Post</h1>
                        <p>There was an error loading this blog post. Please try again later.</p>
                        <a href="blog.html" class="btn-primary">← Back to Blog</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// Simple Markdown to HTML converter
class SimpleMarkdownConverter {
    toHTML(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
        
        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$1. $2</li>');
        
        // Wrap consecutive <li> items in <ul> or <ol>
        html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
            if (match.includes('<li>1.')) {
                return `<ol>${match}</ol>`;
            } else {
                return `<ul>${match}</ul>`;
            }
        });
        
        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
        
        // Paragraphs
        html = html.replace(/^\s*(.+)$/gm, '<p>$1</p>');
        
        // Clean up multiple consecutive <p> tags
        html = html.replace(/<\/p>\s*<p>/g, '</p><p>');
        
        return html;
    }
}

// Initialize blog post page when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Check if we're on a blog post page
    if (window.location.pathname.includes('blog-') && window.location.pathname.endsWith('.html')) {
        window.blogPostPage = new BlogPostPage();
        await window.blogPostPage.init();
    }
});

// Export for use in other scripts
window.BlogPostPage = BlogPostPage;
